import { 
  Activity, 
  Utensils, 
  Clock, 
  AlertTriangle, 
  Stethoscope,
  Target,
  ChevronRight
} from 'lucide-react';

export interface HealthPlan {
  category: string;
  risks: string[];
  actions: {
    title: string;
    description: string;
  }[];
  methods: string[];
  timeline: string;
  meals: {
    name: string;
    why: string;
  }[];
}

export const HEALTH_PLANS: Record<string, HealthPlan> = {
  'Severe Thinness': {
    category: 'Severe Thinness',
    risks: [
      'Weakened immune system and frequent infections',
      'Osteoporosis and increased risk of bone fractures',
      'Anemia and chronic fatigue',
      'Hormonal imbalances and reproductive issues'
    ],
    actions: [
      { title: 'Caloric Surplus', description: 'Increase daily intake by 500-700 calories above maintenance.' },
      { title: 'Medical Screening', description: 'Rule out hyperthyroidism, celiac disease, or other malabsorption issues.' },
      { title: 'Nutrient Density', description: 'Focus on energy-dense whole foods rather than empty calories.' }
    ],
    methods: [
      'Eat 5-6 smaller meals throughout the day instead of 3 large ones.',
      'Add healthy fats like olive oil, nuts, and avocados to every meal.',
      'Drink calories via smoothies if solid food feels too filling.',
      'Limit caffeine as it can suppress appetite.'
    ],
    timeline: '1-2 weeks for improved energy; 2-3 months for healthy weight gain and hormonal stabilization.',
    meals: [
      { name: 'Oatmeal with Nut Butter & Berries', why: 'High in complex carbs and healthy fats for sustained energy.' },
      { name: 'Salmon with Quinoa & Avocado', why: 'Rich in healthy fats and high-quality protein for tissue repair.' }
    ]
  },
  'Moderate Thinness': {
    category: 'Moderate Thinness',
    risks: [
      'Nutritional deficiencies (Iron, Vitamin D, B12)',
      'Muscle wasting (Sarcopenia)',
      'Poor wound healing',
      'Hair loss and skin issues'
    ],
    actions: [
      { title: 'Protein Prioritization', description: 'Aim for 1.2g of protein per kg of body weight to build muscle.' },
      { title: 'Strength Training', description: 'Engage in resistance training to ensure weight gain is muscle, not just fat.' },
      { title: 'Consistent Hydration', description: 'Ensure adequate water intake for metabolic processes.' }
    ],
    methods: [
      'Include a protein source in every snack and meal.',
      'Use larger plates to encourage slightly larger portions.',
      'Track intake for 1 week to identify nutritional gaps.',
      'Prioritize sleep (7-9 hours) for hormonal recovery.'
    ],
    timeline: '2-4 weeks for muscle tone improvement; 3-6 months for reaching a normal BMI range.',
    meals: [
      { name: 'Greek Yogurt with Granola & Honey', why: 'High protein and calorie-dense for healthy weight support.' },
      { name: 'Chicken Breast with Sweet Potato', why: 'Lean protein and complex carbs for muscle building.' }
    ]
  },
  'Mild Thinness': {
    category: 'Mild Thinness',
    risks: [
      'Occasional dizziness or low blood pressure',
      'Sensitivity to cold temperatures',
      'Lowered stamina during physical activity'
    ],
    actions: [
      { title: 'Balanced Surplus', description: 'Add 200-300 extra calories to your daily routine.' },
      { title: 'Muscle Focus', description: 'Focus on compound movements (squats, deadlifts) to build a strong frame.' }
    ],
    methods: [
      'Add a handful of nuts as a daily mid-afternoon snack.',
      'Don\'t skip breakfast; include eggs or whole grains.',
      'Monitor energy levels during workouts.'
    ],
    timeline: '2 weeks for better workout performance; 1-2 months for weight normalization.',
    meals: [
      { name: 'Whole Grain Pasta with Pesto', why: 'Healthy fats from pine nuts/olive oil provide easy extra calories.' },
      { name: 'Turkey & Cheese Sandwich on Rye', why: 'Balanced macros for steady energy and muscle support.' }
    ]
  },
  'Normal': {
    category: 'Normal',
    risks: [
      'Sedentary lifestyle risks (even with normal BMI)',
      'Potential for "Skinny Fat" (high body fat %, low muscle)',
      'Metabolic stiffness if diet is high in sugar'
    ],
    actions: [
      { title: 'Body Recomposition', description: 'Focus on losing fat and gaining muscle simultaneously.' },
      { title: 'Metabolic Flexibility', description: 'Improve your body\'s ability to switch between burning fat and carbs.' },
      { title: 'Functional Fitness', description: 'Maintain mobility and cardiovascular health.' }
    ],
    methods: [
      'Aim for 150 minutes of moderate cardio per week.',
      'Lift weights at least 2 times per week.',
      'Practice mindful eating to maintain current weight.',
      'Reduce ultra-processed food intake to <20% of total calories.'
    ],
    timeline: 'Ongoing maintenance; 4-8 weeks to see improved muscle definition.',
    meals: [
      { name: 'Mediterranean Salad with Chickpeas', why: 'High fiber and healthy fats for long-term heart health.' },
      { name: 'Stir-fry with Lean Beef & Broccoli', why: 'High protein and micronutrients for metabolic efficiency.' }
    ]
  },
  'Overweight': {
    category: 'Overweight',
    risks: [
      'Increased risk of Type 2 Diabetes',
      'High blood pressure and cholesterol',
      'Joint strain and lower back pain',
      'Non-alcoholic fatty liver disease'
    ],
    actions: [
      { title: 'Sustainable Deficit', description: 'Reduce daily intake by 300-500 calories.' },
      { title: 'Increase NEAT', description: 'Non-Exercise Activity Thermogenesis (walking, standing, moving).' },
      { title: 'Fiber Increase', description: 'Eat 30g+ of fiber daily to increase satiety.' }
    ],
    methods: [
      'Walk 8,000 - 10,000 steps daily.',
      'Replace sugary drinks with water or herbal tea.',
      'Use smaller plates to manage portion sizes naturally.',
      'Prioritize protein to stay full longer.'
    ],
    timeline: '1-2 weeks for reduced bloating; 3-6 months for significant, sustainable weight loss (0.5kg/week).',
    meals: [
      { name: 'Lentil Soup with Spinach', why: 'High fiber and protein keep you full on fewer calories.' },
      { name: 'Baked Cod with Roasted Vegetables', why: 'Low calorie density allows for large, satisfying portions.' }
    ]
  },
  'Obese Class I': {
    category: 'Obese Class I',
    risks: [
      'Insulin resistance and metabolic syndrome',
      'Sleep apnea and respiratory issues',
      'Cardiovascular disease and stroke risk',
      'Increased systemic inflammation'
    ],
    actions: [
      { title: 'Structured Nutrition', description: 'Focus on whole, single-ingredient foods.' },
      { title: 'Low-Impact Movement', description: 'Protect joints with swimming, cycling, or walking.' },
      { title: 'Blood Work', description: 'Check fasting glucose, HbA1c, and lipid profile.' }
    ],
    methods: [
      'Eliminate liquid calories (soda, juices, alcohol).',
      'Start with 15-minute daily walks and gradually increase.',
      'Prepare 80% of your meals at home.',
      'Consider intermittent fasting (e.g., 12:12 or 14:10) to control eating windows.'
    ],
    timeline: '4 weeks for improved blood pressure; 6-12 months for transformative health changes.',
    meals: [
      { name: 'Tofu Scramble with Peppers', why: 'Plant-based protein and fiber for metabolic health.' },
      { name: 'Grilled Chicken Salad (No Heavy Dressing)', why: 'High volume, low calorie to manage hunger.' }
    ]
  },
  'Obese Class II': {
    category: 'Obese Class II',
    risks: [
      'Severe cardiovascular strain',
      'High risk of chronic kidney disease',
      'Mobility limitations and chronic pain',
      'Gastroesophageal reflux disease (GERD)'
    ],
    actions: [
      { title: 'Medical Supervision', description: 'Consult a doctor before starting an intense exercise program.' },
      { title: 'Aggressive Fiber Intake', description: 'Use vegetables as the base of every single meal.' },
      { title: 'Stress Management', description: 'Lower cortisol to prevent abdominal fat storage.' }
    ],
    methods: [
      'Focus on "Zone 2" cardio (walking at a pace where you can still talk).',
      'Prioritize anti-inflammatory foods (berries, fatty fish, greens).',
      'Work with a therapist or coach for behavioral change.',
      'Track metrics beyond the scale (waist circumference, energy).'
    ],
    timeline: '1 month for improved mobility; 12-24 months for long-term weight normalization.',
    meals: [
      { name: 'Steamed Broccoli & Tempeh', why: 'Extremely high fiber and clean protein for gut health.' },
      { name: 'Zucchini Noodles with Turkey Bolognese', why: 'Low-carb alternative to reduce insulin spikes.' }
    ]
  },
  'Obese Class III': {
    category: 'Obese Class III',
    risks: [
      'Critical cardiovascular risk',
      'Severe joint degeneration',
      'Type 2 Diabetes complications',
      'Significantly reduced life expectancy'
    ],
    actions: [
      { title: 'Clinical Intervention', description: 'Seek professional medical weight management support.' },
      { title: 'Safety First', description: 'Focus on chair exercises or water aerobics to prevent injury.' },
      { title: 'Mental Health Support', description: 'Address the psychological roots of eating behaviors.' }
    ],
    methods: [
      'Focus on small, non-intimidating wins (e.g., drinking 2L water daily).',
      'Reduce processed sugar to near zero.',
      'Monitor heart rate during any physical activity.',
      'Ensure adequate intake of micronutrients to prevent deficiencies during loss.'
    ],
    timeline: '3 months for noticeable improvement in daily function; 2+ years for a full health transformation.',
    meals: [
      { name: 'Vegetable Broth with Lean Protein', why: 'Hydrating and nutrient-dense without excessive calories.' },
      { name: 'Boiled Eggs & Asparagus', why: 'Simple, high-protein, and low-glycemic for blood sugar control.' }
    ]
  }
};
