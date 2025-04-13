import mongoose, { Types } from 'mongoose';
import connectDB from './db';
import User from '@/models/User';
import Recipe from '@/models/Recipe';
import Comment from '@/models/Comment';
import Cookbook from '@/models/Cookbook';
import MealPlan from '@/models/MealPlan';

async function seed() {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Recipe.deleteMany({});
    await Comment.deleteMany({});
    await Cookbook.deleteMany({});
    await MealPlan.deleteMany({});

    console.log('Creating test users... 👤');

    // Create test users
    const alice = await User.create({
      name: 'Alice Johnson',
      email: 'alice@example.com',
      bio: 'I love cooking Italian food!',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=alice',
    });

    const bob = await User.create({
      name: 'Bob Smith',
      email: 'bob@example.com',
      bio: 'Aspiring chef with a passion for Asian cuisine',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=bob',
    });

    const charlie = await User.create({
      name: 'Charlie Brown',
      email: 'charlie@example.com',
      bio: 'Baking enthusiast and cookbook collector',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=charlie',
    });

    // Test follow functionality
    console.log('Testing follow functionality... 🤝');

    await alice.follow(bob._id as Types.ObjectId);
    console.log('Alice follows Bob ✅');

    await bob.follow(charlie._id as Types.ObjectId);
    console.log('Bob follows Charlie ✅');

    await charlie.follow(alice._id as Types.ObjectId);
    console.log('Charlie follows Alice ✅');

    console.log('\nCreating test recipes... 🍳');

    // Create test recipes
    const carbonara = await Recipe.create({
      title: 'Classic Spaghetti Carbonara',
      description: 'A traditional Roman pasta dish with eggs, cheese, pancetta, and black pepper.',
      ingredients: [
        '400g spaghetti',
        '200g pancetta or guanciale',
        '4 large eggs',
        '100g Pecorino Romano',
        '100g Parmigiano Reggiano',
        'Black pepper',
        'Salt'
      ],
      steps: [
        'Bring a large pot of salted water to boil',
        'Cook pasta according to package instructions',
        'Meanwhile, cook diced pancetta until crispy',
        'Mix eggs, grated cheeses, and black pepper',
        'Combine hot pasta with egg mixture and pancetta',
        'Serve immediately with extra cheese and pepper'
      ],
      media: ['https://example.com/carbonara.jpg'],
      tags: ['Italian', 'Pasta', 'Quick', 'Traditional'],
      difficulty: 'Intermediate',
      prepTime: 15,
      cookTime: 20,
      servings: 4,
      creator: alice._id as Types.ObjectId
    });

    const ramen = await Recipe.create({
      title: 'Homemade Miso Ramen',
      description: 'A warming bowl of Japanese ramen with rich miso broth.',
      ingredients: [
        'Ramen noodles',
        'Miso paste',
        'Pork belly',
        'Soft-boiled eggs',
        'Green onions',
        'Nori',
        'Bamboo shoots'
      ],
      steps: [
        'Prepare miso broth base',
        'Cook pork belly until tender',
        'Boil eggs for 6.5 minutes',
        'Cook noodles al dente',
        'Assemble bowl with broth, noodles, and toppings'
      ],
      media: ['https://example.com/ramen.jpg'],
      tags: ['Japanese', 'Soup', 'Comfort Food'],
      difficulty: 'Advanced',
      prepTime: 30,
      cookTime: 60,
      servings: 4,
      creator: bob._id as Types.ObjectId
    });

    const brownie = await Recipe.create({
      title: 'Fudgy Dark Chocolate Brownies',
      description: 'Rich, fudgy brownies made with dark chocolate.',
      ingredients: [
        '200g dark chocolate',
        '175g butter',
        '325g caster sugar',
        '3 large eggs',
        '130g plain flour',
        'Cocoa powder',
        'Vanilla extract'
      ],
      steps: [
        'Melt chocolate and butter together',
        'Whisk in sugar and eggs',
        'Fold in flour and cocoa',
        'Bake at 180°C for 25 minutes',
        'Let cool before cutting'
      ],
      media: ['https://example.com/brownies.jpg'],
      tags: ['Dessert', 'Chocolate', 'Baking'],
      difficulty: 'Easy',
      prepTime: 20,
      cookTime: 25,
      servings: 16,
      creator: charlie._id as Types.ObjectId
    });

    // Test recipe interactions
    console.log('\nTesting recipe interactions... ❤️');

    await carbonara.like(bob._id as Types.ObjectId);
    await carbonara.like(charlie._id as Types.ObjectId);
    console.log('Carbonara liked by Bob and Charlie ✅');

    await ramen.like(alice._id as Types.ObjectId);
    await ramen.like(charlie._id as Types.ObjectId);
    console.log('Ramen liked by Alice and Charlie ✅');

    await brownie.like(alice._id as Types.ObjectId);
    await brownie.like(bob._id as Types.ObjectId);
    console.log('Brownies liked by Alice and Bob ✅');

    // Create test comments
    console.log('\nCreating test comments... 💬');

    // Comments for Carbonara
    const carbonaraComments = await Promise.all([
      Comment.create({
        content: 'This recipe is amazing! I added extra cheese and it was perfect.',
        author: bob._id as Types.ObjectId,
        recipe: carbonara._id as Types.ObjectId,
      }),
      Comment.create({
        content: 'Great authentic recipe! Just like my nonna used to make.',
        author: charlie._id as Types.ObjectId,
        recipe: carbonara._id as Types.ObjectId,
      }),
      Comment.create({
        content: 'Quick question - can I use bacon instead of pancetta?',
        author: alice._id as Types.ObjectId,
        recipe: carbonara._id as Types.ObjectId,
      }),
    ]);

    // Comments for Ramen
    const ramenComments = await Promise.all([
      Comment.create({
        content: 'The broth is so flavorful! I added extra nori.',
        author: alice._id as Types.ObjectId,
        recipe: ramen._id as Types.ObjectId,
      }),
      Comment.create({
        content: 'Love how detailed the instructions are. My first time making ramen and it turned out great!',
        author: charlie._id as Types.ObjectId,
        recipe: ramen._id as Types.ObjectId,
      }),
      Comment.create({
        content: 'Pro tip: marinate the eggs overnight for extra flavor.',
        author: bob._id as Types.ObjectId,
        recipe: ramen._id as Types.ObjectId,
      }),
    ]);

    // Comments for Brownie
    const brownieComments = await Promise.all([
      Comment.create({
        content: "These are the fudgiest brownies I've ever made! 🍫",
        author: alice._id as Types.ObjectId,
        recipe: brownie._id as Types.ObjectId,
      }),
      Comment.create({
        content: 'Added walnuts to the recipe. Absolutely divine!',
        author: bob._id as Types.ObjectId,
        recipe: brownie._id as Types.ObjectId,
      }),
      Comment.create({
        content: 'Perfect sweetness level. Not too rich, not too light.',
        author: charlie._id as Types.ObjectId,
        recipe: brownie._id as Types.ObjectId,
      }),
    ]);

    // Test comment likes with more interactions
    console.log('Testing comment interactions... 👍');

    // Like comments on Carbonara
    await carbonaraComments[0].like(alice._id as Types.ObjectId);
    await carbonaraComments[0].like(charlie._id as Types.ObjectId);
    await carbonaraComments[1].like(bob._id as Types.ObjectId);
    await carbonaraComments[1].like(alice._id as Types.ObjectId);
    await carbonaraComments[2].like(bob._id as Types.ObjectId);

    // Like comments on Ramen
    await ramenComments[0].like(bob._id as Types.ObjectId);
    await ramenComments[0].like(charlie._id as Types.ObjectId);
    await ramenComments[1].like(alice._id as Types.ObjectId);
    await ramenComments[2].like(alice._id as Types.ObjectId);
    await ramenComments[2].like(charlie._id as Types.ObjectId);

    // Like comments on Brownies
    await brownieComments[0].like(bob._id as Types.ObjectId);
    await brownieComments[0].like(charlie._id as Types.ObjectId);
    await brownieComments[1].like(charlie._id as Types.ObjectId);
    await brownieComments[2].like(alice._id as Types.ObjectId);
    await brownieComments[2].like(bob._id as Types.ObjectId);

    console.log('Comments and likes created successfully ✅');

    // Create test cookbooks
    console.log('\nCreating test cookbooks... 📚');

    const italianClassics = await Cookbook.create({
      title: "Italian Classics",
      description: "A collection of traditional Italian recipes passed down through generations",
      owner: alice._id as Types.ObjectId,
      isPublic: true,
      tags: ['Italian', 'Traditional', 'Pasta'],
      recipes: [carbonara._id as Types.ObjectId],
      coverImage: 'https://example.com/italian-classics.jpg',
    });

    const asianFusion = await Cookbook.create({
      title: "Asian Fusion Favorites",
      description: "Modern takes on classic Asian dishes",
      owner: bob._id as Types.ObjectId,
      isPublic: true,
      tags: ['Asian', 'Fusion', 'Modern'],
      recipes: [ramen._id as Types.ObjectId],
      coverImage: 'https://example.com/asian-fusion.jpg',
    });

    const dessertHeaven = await Cookbook.create({
      title: "Dessert Heaven",
      description: "Sweet treats and decadent desserts",
      owner: charlie._id as Types.ObjectId,
      collaborators: [alice._id as Types.ObjectId],
      isPublic: false,
      tags: ['Desserts', 'Baking', 'Sweet'],
      recipes: [brownie._id as Types.ObjectId],
      coverImage: 'https://example.com/dessert-heaven.jpg',
    });

    // Test cookbook collaborations
    await italianClassics.addCollaborator(bob._id as Types.ObjectId);
    await asianFusion.addCollaborator(charlie._id as Types.ObjectId);
    console.log('Collaborators added successfully ✅');

    // Create test meal plans
    console.log('\nCreating test meal plans... 📅');

    // Weekly meal plan template
    const weeklyTemplate = await MealPlan.create({
      title: "Healthy Week Template",
      owner: alice._id as Types.ObjectId,
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      isTemplate: true,
      meals: [
        {
          date: new Date(),
          breakfast: [{
            recipe: carbonara._id as Types.ObjectId,
            servings: 2,
            completed: false,
          }],
          lunch: [{
            recipe: ramen._id as Types.ObjectId,
            servings: 1,
            completed: false,
          }],
          dinner: [{
            recipe: brownie._id as Types.ObjectId,
            servings: 4,
            notes: "Make extra for tomorrow",
            completed: false,
          }],
        },
      ],
      groceryList: [
        {
          item: "Eggs",
          quantity: 12,
          unit: "pieces",
          category: "Dairy",
          checked: false,
        },
        {
          item: "Spaghetti",
          quantity: 500,
          unit: "g",
          category: "Pasta",
          checked: false,
        },
        {
          item: "Dark Chocolate",
          quantity: 200,
          unit: "g",
          category: "Baking",
          checked: false,
        },
      ],
    });

    // Active meal plan for Bob
    const bobPlan = await weeklyTemplate.createFromTemplate(
      bob._id as Types.ObjectId,
      new Date()
    );

    // Collaborative meal plan
    const familyPlan = await MealPlan.create({
      title: "Family Dinner Week",
      owner: charlie._id as Types.ObjectId,
      collaborators: [alice._id as Types.ObjectId, bob._id as Types.ObjectId],
      startDate: new Date(),
      endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      meals: [
        {
          date: new Date(),
          dinner: [{
            recipe: carbonara._id as Types.ObjectId,
            servings: 6,
            notes: "Family gathering",
            completed: false,
          }],
        },
      ],
      groceryList: [
        {
          item: "Pancetta",
          quantity: 300,
          unit: "g",
          category: "Meat",
          checked: false,
        },
        {
          item: "Parmesan",
          quantity: 200,
          unit: "g",
          category: "Dairy",
          checked: false,
        },
      ],
    });

    // Test meal plan interactions
    await bobPlan.addGroceryItem({
      item: "Olive Oil",
      quantity: 500,
      unit: "ml",
      category: "Oils",
    });

    await familyPlan.toggleGroceryItem(0);
    console.log('Meal plans created successfully ✅');

    // Enhanced stats output
    console.log('\nDatabase Stats 📊');
    console.log('Users:', await User.countDocuments());
    console.log('Recipes:', await Recipe.countDocuments());
    console.log('Comments:', await Comment.countDocuments());
    console.log('Cookbooks:', await Cookbook.countDocuments());
    console.log('Meal Plans:', await MealPlan.countDocuments());

    console.log('\nMeal Plan Stats:');
    console.log('Weekly Template:');
    console.log(' - Days:', weeklyTemplate.meals.length);
    console.log(' - Grocery Items:', weeklyTemplate.groceryList.length);
    console.log('Bob\'s Plan:');
    console.log(' - Days:', bobPlan.meals.length);
    console.log(' - Grocery Items:', bobPlan.groceryList.length);
    console.log('Family Plan:');
    console.log(' - Days:', familyPlan.meals.length);
    console.log(' - Grocery Items:', familyPlan.groceryList.length);
    console.log(' - Collaborators:', familyPlan.collaborators.length);

    console.log('\nSeed completed successfully! 🌱');
  } catch (error) {
    console.error('Seed failed:', error);
  } finally {
    process.exit(0);
  }
}

// Run the seed function
seed();
