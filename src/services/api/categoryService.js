import categoryData from "@/services/mockData/categories.json";

class CategoryService {
  constructor() {
    this.categories = [...categoryData];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 150));
    return [...this.categories];
  }

  async getById(Id) {
    await new Promise(resolve => setTimeout(resolve, 100));
    const category = this.categories.find(c => c.Id === Id);
    if (!category) {
      throw new Error(`Category with Id ${Id} not found`);
    }
    return { ...category };
  }

  create(categoryData) {
    const maxId = Math.max(...this.categories.map(c => c.Id), 0);
    const newCategory = {
      ...categoryData,
      Id: maxId + 1,
      order: this.categories.length,
    };
    
    this.categories.push(newCategory);
    return { ...newCategory };
  }

  update(Id, updates) {
    const index = this.categories.findIndex(c => c.Id === Id);
    if (index === -1) {
      throw new Error(`Category with Id ${Id} not found`);
    }
    
    this.categories[index] = { ...this.categories[index], ...updates };
    return { ...this.categories[index] };
  }

  delete(Id) {
    const index = this.categories.findIndex(c => c.Id === Id);
    if (index === -1) {
      throw new Error(`Category with Id ${Id} not found`);
    }
    
    const deletedCategory = this.categories.splice(index, 1)[0];
    return { ...deletedCategory };
  }
}

export const categoryService = new CategoryService();