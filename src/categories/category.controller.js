import Category from "../categories/category.model.js";

export const addCategory = async (req, res) => {
  const { name, description, ...rest } = req.body;
  try {
    const newCategory = new Category({
      name,
      description,
    });
    Object.assign(newCategory, rest);
    await newCategory.save();
    res
      .status(201)
      .json({ msg: "Category created successfully", category: newCategory });
  } catch (error) {
    console.error("Error creating category:", error);
    res.status(500).json({ msg: "Internal server error" });
  }
};

export const listCategories = async (req, res = response) => {
  const { limit, from } = req.query;
  const query = { status: true };

  const [total, categories] = await Promise.all([
    Category.countDocuments(query),
    Category.find(query).skip(Number(from)).limit(Number(limit)),
  ]);

  res.status(200).json({
    total,
    categories,
  });
};

export const editCategory = async (req, res) => {
  const { id: categoryId } = req.params;
  const { ...rest } = req.body;

  try {
    let updates = {};
    if (rest.name) updates.name = rest.name;
    if (rest.description) updates.description = rest.description;
    updates.updated_at = new Date();

    const updatedCategory = await Category.findByIdAndUpdate(
      categoryId,
      updates,
      {
        new: true,
      }
    );

    res.status(200).json({
      msg: "Category was updated successfully",
      category: updatedCategory,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};

export const deleteCategory = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const existingCategory = await Category.findById(categoryId);
    existingCategory.status = false;
    await existingCategory.save();
    res.json({ msg: "Category deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Internal Server Error" });
  }
};
