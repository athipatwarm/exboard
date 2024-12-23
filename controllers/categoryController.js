const Category = require('../models/Category');

// Create a new category
exports.createCategory = async (req, res) => {
  const category = new Category(req.body);
  try {
    await category.save();
    res.status(201).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get all categories
exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.find({});
    res.status(200).send(categories);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Get a category by ID
exports.getCategoryById = async (req, res) => {
  const _id = req.params.id;
  try {
    const category = await Category.findById(_id);
    if (!category) {
      return res.status(404).send();
    }
    res.status(200).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Update a category by ID
exports.updateCategory = async (req, res) => {
  const _id = req.params.id;
  try {
    const category = await Category.findByIdAndUpdate(_id, req.body, { new: true, runValidators: true });
    if (!category) {
      return res.status(404).send();
    }
    res.status(200).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};

// Delete a category by ID
exports.deleteCategory = async (req, res) => {
  const _id = req.params.id;
  try {
    const category = await Category.findByIdAndDelete(_id);
    if (!category) {
      return res.status(404).send();
    }
    res.status(200).send(category);
  } catch (error) {
    res.status(400).send(error);
  }
};
