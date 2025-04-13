import { Schema, model, models, Types } from 'mongoose';

/**
 * Interface for a single meal in the meal plan
 */
export interface IMeal {
  recipe: Types.ObjectId;
  servings: number;
  notes?: string;
  completed: boolean;
}

/**
 * Interface for a day's meal plan
 */
export interface IMealDay {
  date: Date;
  breakfast?: IMeal[];
  lunch?: IMeal[];
  dinner?: IMeal[];
  snacks?: IMeal[];
}

/**
 * Interface representing a meal plan document in MongoDB
 */
export interface IMealPlan {
  title: string;
  owner: Types.ObjectId;
  collaborators: Types.ObjectId[];
  startDate: Date;
  endDate: Date;
  meals: IMealDay[];
  groceryList: {
    item: string;
    quantity: number;
    unit: string;
    checked: boolean;
    category?: string;
  }[];
  notes?: string;
  isTemplate: boolean;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Mongoose schema for a single meal
 */
const mealSchema = new Schema<IMeal>({
  recipe: {
    type: Schema.Types.ObjectId,
    ref: 'Recipe',
    required: [true, 'Recipe reference is required'],
  },
  servings: {
    type: Number,
    required: [true, 'Number of servings is required'],
    min: [1, 'Servings must be at least 1'],
  },
  notes: String,
  completed: {
    type: Boolean,
    default: false,
  },
});

/**
 * Mongoose schema for a day's meal plan
 */
const mealDaySchema = new Schema<IMealDay>({
  date: {
    type: Date,
    required: [true, 'Date is required'],
  },
  breakfast: [mealSchema],
  lunch: [mealSchema],
  dinner: [mealSchema],
  snacks: [mealSchema],
});

/**
 * Mongoose schema for meal plans
 */
const mealPlanSchema = new Schema<IMealPlan>(
  {
    title: {
      type: String,
      required: [true, 'Meal plan title is required'],
      trim: true,
      maxlength: [100, 'Title cannot be longer than 100 characters'],
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Meal plan owner is required'],
    },
    collaborators: [{
      type: Schema.Types.ObjectId,
      ref: 'User',
    }],
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
      validate: {
        validator: function(this: IMealPlan, endDate: Date) {
          return endDate >= this.startDate;
        },
        message: 'End date must be after or equal to start date',
      },
    },
    meals: [mealDaySchema],
    groceryList: [{
      item: {
        type: String,
        required: true,
        trim: true,
      },
      quantity: {
        type: Number,
        required: true,
        min: 0,
      },
      unit: {
        type: String,
        required: true,
        trim: true,
      },
      checked: {
        type: Boolean,
        default: false,
      },
      category: String,
    }],
    notes: String,
    isTemplate: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
mealPlanSchema.index({ owner: 1 });
mealPlanSchema.index({ startDate: 1, endDate: 1 });
mealPlanSchema.index({ isTemplate: 1 });

/**
 * Add a collaborator to the meal plan
 * @param userId - The ID of the user to add as collaborator
 */
mealPlanSchema.methods.addCollaborator = async function(userId: Types.ObjectId) {
  if (!this.collaborators.includes(userId)) {
    this.collaborators.push(userId);
    await this.save();
  }
};

/**
 * Remove a collaborator from the meal plan
 * @param userId - The ID of the user to remove from collaborators
 */
mealPlanSchema.methods.removeCollaborator = async function(userId: Types.ObjectId) {
  if (this.collaborators.includes(userId)) {
    this.collaborators = this.collaborators.filter((id: Types.ObjectId) => !id.equals(userId));
    await this.save();
  }
};

/**
 * Add a meal to a specific day and time
 * @param date - The date to add the meal to
 * @param mealTime - The meal time (breakfast, lunch, dinner, snacks)
 * @param meal - The meal to add
 */
mealPlanSchema.methods.addMeal = async function(
  date: Date,
  mealTime: 'breakfast' | 'lunch' | 'dinner' | 'snacks',
  meal: IMeal
) {
  const dayPlan = this.meals.find((day: IMealDay) => day.date.toDateString() === date.toDateString());
  if (dayPlan) {
    dayPlan[mealTime].push(meal);
  } else {
    this.meals.push({
      date,
      [mealTime]: [meal],
    });
  }
  await this.save();
};

/**
 * Add an item to the grocery list
 * @param item - The grocery item details
 */
mealPlanSchema.methods.addGroceryItem = async function(item: {
  item: string;
  quantity: number;
  unit: string;
  category?: string;
}) {
  this.groceryList.push({ ...item, checked: false });
  await this.save();
};

/**
 * Toggle the checked status of a grocery item
 * @param itemIndex - The index of the item in the grocery list
 */
mealPlanSchema.methods.toggleGroceryItem = async function(itemIndex: number) {
  if (this.groceryList[itemIndex]) {
    this.groceryList[itemIndex].checked = !this.groceryList[itemIndex].checked;
    await this.save();
  }
};

/**
 * Create a new meal plan from a template
 * @param ownerId - The ID of the new owner
 * @param startDate - The start date for the new plan
 * @returns A new meal plan based on this template
 */
mealPlanSchema.methods.createFromTemplate = async function(
  ownerId: Types.ObjectId,
  startDate: Date
) {
  if (!this.isTemplate) {
    throw new Error('Can only create new plans from templates');
  }

  const daysDiff = Math.ceil(
    (this.endDate.getTime() - this.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const endDate = new Date(startDate);
  endDate.setDate(startDate.getDate() + daysDiff);

  const newPlan = {
    ...this.toObject(),
    _id: undefined,
    owner: ownerId,
    collaborators: [],
    startDate,
    endDate,
    isTemplate: false,
    meals: this.meals.map((day: IMealDay) => ({
      ...day,
      date: new Date(startDate.getTime() +
        (day.date.getTime() - this.startDate.getTime())),
    })),
    groceryList: this.groceryList.map((item: {
      item: string;
      quantity: number;
      unit: string;
      checked: boolean;
      category?: string;
    }) => ({
      ...item,
      checked: false,
    })),
  };

  return model<IMealPlan>('MealPlan').create(newPlan);
};

// Create or get the model
const MealPlan = models.MealPlan || model<IMealPlan>('MealPlan', mealPlanSchema);

export default MealPlan;
