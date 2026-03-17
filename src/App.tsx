import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  Info, 
  AlertCircle, 
  CheckCircle2, 
  Scale, 
  Ruler, 
  User, 
  Printer,
  Share2,
  ChevronUp,
  Heart,
  ShieldCheck,
  Mail,
  ExternalLink,
  ArrowRight,
  X
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import Markdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import rehypeRaw from 'rehype-raw';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { 
  BrowserRouter, 
  Routes, 
  Route, 
  useNavigate, 
  useParams,
  useLocation
} from 'react-router-dom';
import { BLOG_POSTS, type BlogPost } from './BlogContent';
import { LEGAL_CONTENT } from './LegalContent';
import { HEALTH_PLANS } from './HealthPlans';
import { 
  Activity, 
  Utensils, 
  Clock, 
  AlertTriangle, 
  Stethoscope,
  Target,
  ChevronRight
} from 'lucide-react';

// Utility for tailwind classes
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Types
type UnitSystem = 'US' | 'Metric';
type Gender = 'male' | 'female';

interface BmiResult {
  bmi: number;
  category: string;
  color: string;
  prime: number;
  ponderalIndex: number;
  healthyRange: { min: number; max: number };
  healthyWeightRange: { min: number; max: number };
  suggestion: string;
}

const BMI_CATEGORIES = [
  { 
    label: 'Severe Thinness', 
    min: 0, 
    max: 16, 
    color: 'text-blue-600', 
    bg: 'bg-blue-600',
    suggestion: 'Your BMI indicates severe thinness. It is important to consult a healthcare professional to rule out underlying conditions and develop a nutrient-dense nutrition plan.'
  },
  { 
    label: 'Moderate Thinness', 
    min: 16, 
    max: 17, 
    color: 'text-blue-500', 
    bg: 'bg-blue-500',
    suggestion: 'Your BMI is in the moderate thinness range. Focus on increasing your intake of healthy fats, proteins, and complex carbohydrates. Consider strength training to build muscle mass.'
  },
  { 
    label: 'Mild Thinness', 
    min: 17, 
    max: 18.5, 
    color: 'text-blue-400', 
    bg: 'bg-blue-400',
    suggestion: 'You are slightly underweight. Small adjustments to your daily caloric intake and focusing on nutrient-rich snacks can help you reach a healthier weight range.'
  },
  { 
    label: 'Normal', 
    min: 18.5, 
    max: 25, 
    color: 'text-emerald-500', 
    bg: 'bg-emerald-500',
    suggestion: 'Great job! You are in the healthy weight range. Maintain your current lifestyle with a balanced diet and at least 150 minutes of moderate physical activity per week.'
  },
  { 
    label: 'Overweight', 
    min: 25, 
    max: 30, 
    color: 'text-yellow-500', 
    bg: 'bg-yellow-500',
    suggestion: 'Your BMI is in the overweight category. Focus on a sustainable calorie deficit through portion control and increasing your daily movement. Consistency is key to long-term health.'
  },
  { 
    label: 'Obese Class I', 
    min: 30, 
    max: 35, 
    color: 'text-orange-500', 
    bg: 'bg-orange-500',
    suggestion: 'Your BMI indicates Class I obesity. We recommend consulting a nutritionist or doctor to create a personalized plan focusing on whole foods and regular cardiovascular exercise.'
  },
  { 
    label: 'Obese Class II', 
    min: 35, 
    max: 40, 
    color: 'text-red-500', 
    bg: 'bg-red-500',
    suggestion: 'Your BMI is in the Class II obesity range. This increases the risk of health complications. A structured approach to weight management and regular medical check-ups are highly recommended.'
  },
  { 
    label: 'Obese Class III', 
    min: 40, 
    max: Infinity, 
    color: 'text-red-700', 
    bg: 'bg-red-700',
    suggestion: 'Your BMI indicates Class III obesity. It is vital to work closely with healthcare professionals to manage health risks and develop a safe, long-term weight loss and wellness strategy.'
  },
];

function BmiApp() {
  const navigate = useNavigate();
  const { blogId } = useParams();
  const location = useLocation();

  const [unitSystem, setUnitSystem] = useState<UnitSystem>('US');
  const [age, setAge] = useState<number>(25);
  const [gender, setGender] = useState<Gender>('female');
  
  // US Units
  const [feet, setFeet] = useState<number>(5);
  const [inches, setInches] = useState<number>(10);
  const [pounds, setPounds] = useState<number>(160);
  
  // Metric Units
  const [cm, setCm] = useState<number>(178);
  const [kg, setKg] = useState<number>(72.5);
  
  const [result, setResult] = useState<BmiResult | null>(null);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [activeLegalPage, setActiveLegalPage] = useState<keyof typeof LEGAL_CONTENT | null>(null);
  const [activeBlogPost, setActiveBlogPost] = useState<BlogPost>(BLOG_POSTS[0]);

  // Sync active blog post with URL
  useEffect(() => {
    if (blogId) {
      const post = BLOG_POSTS.find(p => p.id === blogId);
      if (post) {
        setActiveBlogPost(post);
        // If we just loaded a blog post URL, scroll to it
        if (location.pathname.startsWith('/blog/')) {
          setTimeout(() => {
            document.getElementById('blog-content')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }, 100);
        }
      }
    }
  }, [blogId, location.pathname]);

  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const calculateBmi = () => {
    let weightKg: number;
    let heightM: number;

    if (unitSystem === 'US') {
      const totalInches = feet * 12 + inches;
      weightKg = pounds * 0.453592;
      heightM = totalInches * 0.0254;
    } else {
      weightKg = kg;
      heightM = cm / 100;
    }

    if (heightM <= 0 || weightKg <= 0) return;

    const bmi = weightKg / (heightM * heightM);
    const prime = bmi / 25;
    const ponderalIndex = weightKg / Math.pow(heightM, 3);
    
    const category = BMI_CATEGORIES.find(cat => bmi >= cat.min && bmi < cat.max) || BMI_CATEGORIES[BMI_CATEGORIES.length - 1];
    
    const healthyWeightMin = 18.5 * (heightM * heightM);
    const healthyWeightMax = 25 * (heightM * heightM);

    setResult({
      bmi: parseFloat(bmi.toFixed(1)),
      category: category.label,
      color: category.color,
      prime: parseFloat(prime.toFixed(2)),
      ponderalIndex: parseFloat(ponderalIndex.toFixed(1)),
      healthyRange: { min: 18.5, max: 25 },
      healthyWeightRange: { 
        min: unitSystem === 'US' ? parseFloat((healthyWeightMin / 0.453592).toFixed(1)) : parseFloat(healthyWeightMin.toFixed(1)),
        max: unitSystem === 'US' ? parseFloat((healthyWeightMax / 0.453592).toFixed(1)) : parseFloat(healthyWeightMax.toFixed(1))
      },
      suggestion: category.suggestion
    });
  };

  useEffect(() => {
    calculateBmi();
  }, [unitSystem, feet, inches, pounds, cm, kg, age, gender]);

  return (
    <div className="min-h-screen bg-[#F5F5F3] text-[#1A1A1A] font-sans selection:bg-emerald-100 scroll-smooth scroll-pt-20">
        <Helmet>
          <title>{activeBlogPost ? `${activeBlogPost.title} | Accurate BMI Calculator` : 'Accurate BMI Calculator | Professional Health Metrics'}</title>
          <meta name="description" content={activeBlogPost ? activeBlogPost.description : 'Calculate your Body Mass Index (BMI) with precision. Get personalized health roadmaps, expert nutrition advice, and evidence-based wellness guides.'} />
          
          {/* JSON-LD Structured Data */}
          <script type="application/ld+json">
            {JSON.stringify({
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Accurate BMI Calculator",
              "operatingSystem": "Web",
              "applicationCategory": "HealthApplication",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              }
            })}
          </script>
          
          {activeBlogPost && (
            <script type="application/ld+json">
              {JSON.stringify({
                "@context": "https://schema.org",
                "@type": "BlogPosting",
                "headline": activeBlogPost.title,
                "description": activeBlogPost.description,
                "author": {
                  "@type": "Person",
                  "name": activeBlogPost.author.name,
                  "jobTitle": activeBlogPost.author.role
                },
                "datePublished": activeBlogPost.date
              })}
            </script>
          )}
        </Helmet>
      {/* Floating Back to Top */}
      <AnimatePresence>
        {showScrollTop && (
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="fixed bottom-8 right-8 z-40 p-4 bg-emerald-500 text-white rounded-full shadow-lg hover:bg-emerald-600 transition-colors"
          >
            <ChevronUp size={24} />
          </motion.button>
        )}
      </AnimatePresence>

      {/* Legal Modal */}
      <AnimatePresence>
        {activeLegalPage && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveLegalPage(null)}
              className="absolute inset-0 bg-zinc-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-3xl max-h-[80vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            >
              <div className="p-6 border-b border-zinc-100 flex items-center justify-between bg-zinc-50/50">
                <h3 className="text-xl font-bold text-zinc-900">{LEGAL_CONTENT[activeLegalPage].title}</h3>
                <button
                  onClick={() => setActiveLegalPage(null)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-400 hover:text-zinc-600"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="p-8 overflow-y-auto custom-scrollbar">
                <div className="prose prose-zinc prose-sm max-w-none prose-headings:font-bold prose-h1:text-2xl prose-h2:text-xl prose-p:text-zinc-600 prose-li:text-zinc-600">
                  <Markdown>{LEGAL_CONTENT[activeLegalPage].content}</Markdown>
                </div>
              </div>
              <div className="p-6 border-t border-zinc-100 bg-zinc-50/50 flex justify-end">
                <button
                  onClick={() => setActiveLegalPage(null)}
                  className="px-6 py-2 bg-zinc-900 text-white rounded-xl font-bold text-sm hover:bg-zinc-800 transition-colors"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className="border-b border-zinc-200 bg-white sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
              <Calculator size={18} />
            </div>
            <h1 className="text-lg font-semibold tracking-tight">Accurate BMI Calculator</h1>
          </div>
          <nav className="hidden md:flex items-center gap-6">
            <a href="#" className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors">Calculator</a>
            <a href="#blog" className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors">Health Blog</a>
            <a href="#risks" className="text-sm font-medium text-zinc-600 hover:text-emerald-600 transition-colors">Health Risks</a>
          </nav>
          <div className="flex items-center gap-4">
            <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500">
              <Printer size={20} />
            </button>
            <button className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500">
              <Share2 size={20} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8 md:py-12">
        <div className="space-y-16">
          {/* Calculator Section */}
          <div className="space-y-8">
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-200">
              <div className="flex flex-col lg:flex-row items-center gap-8">
                <div className="flex bg-zinc-100 p-1 rounded-xl shrink-0">
                  {(['US', 'Metric'] as UnitSystem[]).map((sys) => (
                    <button
                      key={sys}
                      onClick={() => setUnitSystem(sys)}
                      className={cn(
                        "px-6 py-2 text-sm font-bold rounded-lg transition-all",
                        unitSystem === sys 
                          ? "bg-white text-emerald-600 shadow-sm" 
                          : "text-zinc-500 hover:text-zinc-800"
                      )}
                    >
                      {sys}
                    </button>
                  ))}
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 w-full">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                      <User size={12} /> Age
                    </label>
                    <input 
                      type="number" 
                      value={age}
                      onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                      className="w-full bg-zinc-50 border border-zinc-200 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono text-sm"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400">Gender</label>
                    <div className="flex bg-zinc-50 border border-zinc-200 rounded-xl p-1">
                      {(['male', 'female'] as Gender[]).map((g) => (
                        <button
                          key={g}
                          onClick={() => setGender(g)}
                          className={cn(
                            "flex-1 py-1.5 rounded-lg text-xs font-bold transition-all capitalize",
                            gender === g 
                              ? "bg-white text-emerald-600 shadow-sm" 
                              : "text-zinc-400 hover:text-zinc-600"
                          )}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                      <Ruler size={12} /> Height
                    </label>
                    {unitSystem === 'US' ? (
                      <div className="flex gap-2">
                        <div className="relative flex-1">
                          <input 
                            type="number" 
                            value={feet}
                            onChange={(e) => setFeet(parseInt(e.target.value) || 0)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300">FT</span>
                        </div>
                        <div className="relative flex-1">
                          <input 
                            type="number" 
                            value={inches}
                            onChange={(e) => setInches(parseInt(e.target.value) || 0)}
                            className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-3 pr-8 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono text-sm"
                          />
                          <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300">IN</span>
                        </div>
                      </div>
                    ) : (
                      <div className="relative">
                        <input 
                          type="number" 
                          value={cm}
                          onChange={(e) => setCm(parseInt(e.target.value) || 0)}
                          className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-4 pr-10 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono text-sm"
                        />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300">CM</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-zinc-400 flex items-center gap-2">
                      <Scale size={12} /> Weight
                    </label>
                    <div className="relative">
                      <input 
                        type="number" 
                        value={unitSystem === 'US' ? pounds : kg}
                        onChange={(e) => unitSystem === 'US' ? setPounds(parseFloat(e.target.value) || 0) : setKg(parseFloat(e.target.value) || 0)}
                        className="w-full bg-zinc-50 border border-zinc-200 rounded-xl pl-4 pr-12 py-2.5 focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all font-mono text-sm"
                      />
                      <span className="absolute right-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-zinc-300 uppercase">
                        {unitSystem === 'US' ? 'LBS' : 'KG'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Results Card */}
          <AnimatePresence mode="wait">
            {result && (
              <div className="space-y-8">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-white rounded-[2.5rem] p-10 shadow-sm border border-zinc-200"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
                    <div className="lg:col-span-5 flex flex-col items-center">
                      <div className="relative w-64 h-64 flex items-center justify-center shrink-0">
                        <svg className="w-full h-full -rotate-90">
                          <circle cx="128" cy="128" r="112" fill="none" stroke="#F4F4F5" strokeWidth="20" />
                          <circle
                            cx="128"
                            cy="128"
                            r="112"
                            fill="none"
                            stroke="currentColor"
                            strokeWidth="20"
                            strokeDasharray={703}
                            strokeDashoffset={703 - (Math.min(result.bmi, 40) / 40) * 703}
                            className={cn("transition-all duration-1000 ease-out", result.color.replace('text', 'stroke'))}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
                          <span className={cn("text-6xl font-black font-mono tracking-tighter transition-colors duration-500", result.color)}>
                            {result.bmi}
                          </span>
                          <span className={cn("text-sm font-bold uppercase tracking-widest mt-2 transition-colors duration-500", result.color)}>
                            {result.category}
                          </span>
                          <div className="h-px w-12 bg-zinc-100 my-3" />
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">BMI Units</span>
                        </div>
                      </div>
                    </div>

                    <div className="lg:col-span-7 space-y-10">
                      <div className="grid grid-cols-2 gap-x-12 gap-y-8">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Healthy Range</span>
                          <p className="text-xl font-mono font-bold">{result.healthyRange.min} - {result.healthyRange.max}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Healthy Weight</span>
                          <p className="text-xl font-mono font-bold">{result.healthyWeightRange.min} - {result.healthyWeightRange.max} <span className="text-xs font-normal text-zinc-400 uppercase">{unitSystem === 'US' ? 'lbs' : 'kg'}</span></p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">BMI Prime</span>
                          <p className="text-xl font-mono font-bold">{result.prime}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Ponderal Index</span>
                          <p className="text-xl font-mono font-bold">{result.ponderalIndex} <span className="text-xs font-normal text-zinc-400 uppercase">kg/m³</span></p>
                        </div>
                      </div>

                      <div className="bg-zinc-50 rounded-3xl p-8 border border-zinc-100 relative overflow-hidden">
                        <div className={cn("absolute left-0 top-0 bottom-0 w-1.5", result.color.replace('text', 'bg'))} />
                        <h3 className="text-sm font-bold mb-3 flex items-center gap-2">
                          <CheckCircle2 size={16} className={result.color} />
                          Personalized Suggestion
                        </h3>
                        <p className="text-sm text-zinc-600 leading-relaxed">
                          {result.suggestion}
                        </p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Personalized Health Roadmap */}
                {HEALTH_PLANS[result.category] && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="space-y-8"
                  >
                    <div className="flex items-center gap-4">
                      <div className="h-px flex-1 bg-zinc-200" />
                      <h2 className="text-xs font-bold uppercase tracking-[0.2em] text-zinc-400">Personalized Health Roadmap</h2>
                      <div className="h-px flex-1 bg-zinc-200" />
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                      {/* Column 1: Risks & Actions */}
                      <div className="space-y-8">
                        <div className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm space-y-6">
                          <div className="flex items-center gap-3 text-red-600">
                            <AlertTriangle size={20} />
                            <h3 className="font-bold tracking-tight">Health Risks</h3>
                          </div>
                          <ul className="space-y-4">
                            {HEALTH_PLANS[result.category].risks.map((risk, i) => (
                              <li key={i} className="flex gap-3 text-sm text-zinc-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-red-200 mt-1.5 shrink-0" />
                                {risk}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm space-y-6">
                          <div className="flex items-center gap-3 text-emerald-600">
                            <Target size={20} />
                            <h3 className="font-bold tracking-tight">Priority Actions</h3>
                          </div>
                          <div className="space-y-4">
                            {HEALTH_PLANS[result.category].actions.map((action, i) => (
                              <div key={i} className="space-y-1">
                                <p className="text-sm font-bold text-zinc-900">{action.title}</p>
                                <p className="text-xs text-zinc-500 leading-relaxed">{action.description}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>

                      {/* Column 2: Methods & Timeline */}
                      <div className="space-y-8">
                        <div className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm space-y-6">
                          <div className="flex items-center gap-3 text-indigo-600">
                            <Activity size={20} />
                            <h3 className="font-bold tracking-tight">How to Implement</h3>
                          </div>
                          <ul className="space-y-4">
                            {HEALTH_PLANS[result.category].methods.map((method, i) => (
                              <li key={i} className="flex gap-3 text-sm text-zinc-600">
                                <ChevronRight size={14} className="mt-1 shrink-0 text-indigo-300" />
                                {method}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div className="bg-zinc-900 rounded-[2rem] p-8 text-white space-y-4">
                          <div className="flex items-center gap-3 text-emerald-400">
                            <Clock size={20} />
                            <h3 className="font-bold tracking-tight">Expected Timeline</h3>
                          </div>
                          <p className="text-sm text-zinc-400 leading-relaxed">
                            {HEALTH_PLANS[result.category].timeline}
                          </p>
                        </div>
                      </div>

                      {/* Column 3: Nutrition & Disclaimer */}
                      <div className="space-y-8">
                        <div className="bg-white rounded-[2rem] p-8 border border-zinc-200 shadow-sm space-y-6">
                          <div className="flex items-center gap-3 text-orange-600">
                            <Utensils size={20} />
                            <h3 className="font-bold tracking-tight">Recommended Meals</h3>
                          </div>
                          <div className="space-y-6">
                            {HEALTH_PLANS[result.category].meals.map((meal, i) => (
                              <div key={i} className="space-y-2">
                                <p className="text-sm font-bold text-zinc-900">{meal.name}</p>
                                <div className="p-3 bg-orange-50 rounded-xl border border-orange-100">
                                  <p className="text-[11px] text-orange-800 leading-relaxed">
                                    <span className="font-bold uppercase text-[9px] block mb-1">Why this meal?</span>
                                    {meal.why}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="bg-amber-50 rounded-[2rem] p-8 border border-amber-100 space-y-4">
                          <div className="flex items-center gap-3 text-amber-700">
                            <Stethoscope size={20} />
                            <h3 className="font-bold tracking-tight">Medical Notice</h3>
                          </div>
                          <p className="text-xs text-amber-800/80 leading-relaxed italic">
                            These suggestions are evidence-based recommendations for educational purposes only. They are not a substitute for professional medical advice, diagnosis, or treatment. Always consult with a physician or qualified healthcare provider before making significant changes to your diet or exercise routine.
                          </p>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}
              </div>
            )}
          </AnimatePresence>

          {/* Health Blog Section */}
          <section id="blog" className="pt-8 space-y-12">
            <div className="space-y-4 text-center">
              <h2 className="text-4xl font-black tracking-tight text-zinc-900">Health & Wellness Library</h2>
              <p className="text-zinc-500 max-w-2xl mx-auto">Expert-written, evidence-based guides to help you understand your body and optimize your health journey.</p>
            </div>

            {/* Grid of Blog Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-6">
              {BLOG_POSTS.map((post) => (
                <motion.div
                  key={post.id}
                  whileHover={{ y: -8, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => {
                    navigate(`/blog/${post.id}`);
                  }}
                  className={cn(
                    "bg-white rounded-[2rem] p-6 border transition-all cursor-pointer flex flex-col group relative overflow-hidden",
                    activeBlogPost.id === post.id 
                      ? "border-emerald-500 ring-4 ring-emerald-500/5 shadow-xl shadow-emerald-500/10" 
                      : "border-zinc-200 shadow-sm hover:shadow-2xl hover:border-emerald-200"
                  )}
                >
                  {activeBlogPost.id === post.id && (
                    <div className="absolute top-0 right-0 p-4">
                      <div className="bg-emerald-500 text-white p-1 rounded-full">
                        <CheckCircle2 size={16} />
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center gap-3 mb-6">
                    <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full">
                      {post.readTime}
                    </span>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                      {post.date}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-zinc-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">
                    {post.title}
                  </h3>
                  
                  <p className="text-sm text-zinc-500 leading-relaxed mb-8 flex-1 line-clamp-3">
                    {post.description}
                  </p>

                  <div className="flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-2 text-emerald-600 font-bold text-sm">
                      Read Article 
                      <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform" />
                    </div>
                    <div className="w-8 h-8 rounded-full bg-zinc-50 flex items-center justify-center text-zinc-300 group-hover:bg-emerald-50 group-hover:text-emerald-500 transition-colors">
                      <ChevronRight size={16} />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Blog Content Area */}
            <div className="pt-16" id="blog-content">
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeBlogPost.id}
                  initial={{ opacity: 0, y: 40 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -40 }}
                  transition={{ duration: 0.5, ease: "easeOut" }}
                  className="bg-white rounded-[3rem] p-8 md:p-20 shadow-sm border border-zinc-200"
                >
                  <div className="max-w-3xl mx-auto space-y-12">
                    <div className="markdown-body prose prose-zinc max-w-none prose-headings:tracking-tight prose-h1:text-4xl prose-h1:font-black prose-h1:text-zinc-900 prose-h2:text-2xl prose-h2:font-bold prose-h2:text-emerald-600 prose-h2:mt-12 prose-h2:mb-6 prose-p:text-zinc-600 prose-p:leading-relaxed prose-li:text-zinc-600 prose-table:text-sm prose-strong:text-zinc-900 prose-a:text-emerald-600 prose-a:no-underline hover:prose-a:underline">
                      <Markdown rehypePlugins={[rehypeSlug, rehypeRaw]}>{activeBlogPost.content}</Markdown>
                    </div>

                    {/* Author Bio Section */}
                    <div className="mt-16 p-8 bg-zinc-50 rounded-3xl border border-zinc-100 flex flex-col md:flex-row gap-8 items-center md:items-start">
                      <div className="w-20 h-20 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <User size={40} />
                      </div>
                      <div className="space-y-4 text-center md:text-left">
                        <div className="space-y-1">
                          <h4 className="text-xl font-bold text-zinc-900">{activeBlogPost.author.name}</h4>
                          <p className="text-sm font-bold text-emerald-600 uppercase tracking-widest">{activeBlogPost.author.role}</p>
                        </div>
                        <p className="text-sm text-zinc-500 leading-relaxed italic">
                          "{activeBlogPost.author.bio}"
                        </p>
                      </div>
                    </div>

                    {/* Citations Section */}
                    <div className="mt-8 space-y-4">
                      <h5 className="text-xs font-bold uppercase tracking-widest text-zinc-400">Scientific References</h5>
                      <ul className="space-y-2">
                        {activeBlogPost.citations.map((cite, i) => (
                          <li key={i}>
                            <a 
                              href={cite.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-xs text-zinc-500 hover:text-emerald-600 flex items-center gap-2 transition-colors"
                            >
                              <ExternalLink size={12} className="text-zinc-300" />
                              {cite.text}
                            </a>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Bottom Call to Action */}
                    <div className="mt-16 p-8 bg-zinc-900 rounded-3xl text-white flex flex-col md:flex-row items-center justify-between gap-8">
                      <div className="space-y-2">
                        <h4 className="text-xl font-bold">Ready to track your health?</h4>
                        <p className="text-zinc-400 text-sm">Use our accurate calculator to get your BMI results in seconds.</p>
                      </div>
                      <button 
                        onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                        className="px-8 py-3 bg-emerald-500 text-white rounded-xl font-bold hover:bg-emerald-600 transition-colors shrink-0"
                      >
                        Back to Calculator
                      </button>
                    </div>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </section>
            
            {/* Back to Top Button */}
            <div className="flex justify-center mt-12">
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                className="flex items-center gap-2 px-6 py-3 bg-white border border-zinc-200 rounded-full text-sm font-bold text-zinc-600 hover:bg-zinc-50 hover:text-emerald-600 transition-all shadow-sm"
              >
                <ChevronUp size={16} />
                Back to Top
              </button>
            </div>

          {/* Risks Section */}
          <div id="risks" className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <section className="lg:col-span-2 bg-white rounded-3xl p-8 shadow-sm border border-zinc-200">
              <h3 className="text-lg font-bold mb-6 flex items-center gap-2">
                <Info size={18} className="text-emerald-500" />
                Understanding BMI
              </h3>
              <div className="prose prose-zinc max-w-none text-sm leading-relaxed text-zinc-600">
                <p>
                  Body Mass Index (BMI) is a measurement of a person's leanness or corpulence based on their height and weight. It is widely used as a general indicator of whether a person has a healthy body weight for their height.
                </p>
                <div className="mt-8 overflow-hidden rounded-2xl border border-zinc-100">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-zinc-50">
                        <th className="px-4 py-3 font-bold text-zinc-900">Classification</th>
                        <th className="px-4 py-3 font-bold text-zinc-900">BMI Range</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-100">
                      {BMI_CATEGORIES.map((cat, i) => (
                        <tr key={i} className="hover:bg-zinc-50/50 transition-colors">
                          <td className="px-4 py-3">{cat.label}</td>
                          <td className="px-4 py-3 font-mono">{cat.min === 0 ? '< 16' : cat.max === Infinity ? '> 40' : `${cat.min} - ${cat.max}`}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </section>

            <div className="space-y-8">
              <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-200">
                <h3 className="text-lg font-bold mb-4 text-red-600">Overweight Risks</h3>
                <ul className="space-y-3 text-sm text-zinc-600">
                  {[
                    'High blood pressure',
                    'Type II diabetes',
                    'Coronary heart disease',
                    'Sleep apnea'
                  ].map((risk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertCircle size={14} className="mt-1 shrink-0 text-red-400" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </section>

              <section className="bg-white rounded-3xl p-8 shadow-sm border border-zinc-200">
                <h3 className="text-lg font-bold mb-4 text-blue-600">Underweight Risks</h3>
                <ul className="space-y-3 text-sm text-zinc-600">
                  {[
                    'Malnutrition',
                    'Osteoporosis',
                    'Decreased immune function',
                    'Growth issues'
                  ].map((risk, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <AlertCircle size={14} className="mt-1 shrink-0 text-blue-400" />
                      {risk}
                    </li>
                  ))}
                </ul>
              </section>
            </div>
          </div>

          {/* FAQ Section */}
          <section className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-sm border border-zinc-200">
            <div className="max-w-3xl mx-auto space-y-12">
              <div className="text-center space-y-4">
                <h2 className="text-3xl font-black tracking-tight text-zinc-900">Frequently Asked Questions</h2>
                <p className="text-zinc-500">Common questions about BMI, health metrics, and weight management.</p>
              </div>
              
              <div className="space-y-6">
                {[
                  {
                    q: "Is BMI accurate for everyone?",
                    a: "BMI is a reliable screening tool for most adults. However, it may not be accurate for athletes with high muscle mass, pregnant women, or the elderly. It should be used alongside other metrics like waist circumference."
                  },
                  {
                    q: "What is a healthy BMI range?",
                    a: "For most adults, a healthy BMI range is between 18.5 and 24.9. Ranges below 18.5 are considered underweight, while ranges above 25 are considered overweight or obese."
                  },
                  {
                    q: "How often should I check my BMI?",
                    a: "Checking your BMI once every few months is usually sufficient to track long-term trends. Focus on consistent lifestyle habits rather than daily fluctuations."
                  }
                ].map((faq, i) => (
                  <div key={i} className="p-6 bg-zinc-50 rounded-2xl border border-zinc-100 space-y-3">
                    <h4 className="font-bold text-zinc-900 flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-emerald-500 text-white flex items-center justify-center text-[10px]">Q</div>
                      {faq.q}
                    </h4>
                    <p className="text-sm text-zinc-600 leading-relaxed pl-9">{faq.a}</p>
                  </div>
                ))}
              </div>

              {/* FAQ Schema */}
              <script type="application/ld+json">
                {JSON.stringify({
                  "@context": "https://schema.org",
                  "@type": "FAQPage",
                  "mainEntity": [
                    {
                      "@type": "Question",
                      "name": "Is BMI accurate for everyone?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "BMI is a reliable screening tool for most adults. However, it may not be accurate for athletes with high muscle mass, pregnant women, or the elderly."
                      }
                    },
                    {
                      "@type": "Question",
                      "name": "What is a healthy BMI range?",
                      "acceptedAnswer": {
                        "@type": "Answer",
                        "text": "For most adults, a healthy BMI range is between 18.5 and 24.9."
                      }
                    }
                  ]
                })}
              </script>
            </div>
          </section>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-white pt-16 pb-8 mt-24">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
            {/* Brand Column */}
            <div className="space-y-6">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center text-white">
                  <Calculator size={18} />
                </div>
                <span className="text-lg font-bold tracking-tight">Accurate BMI Calculator</span>
              </div>
              <p className="text-sm text-zinc-500 leading-relaxed">
                Empowering individuals with professional-grade health metrics and evidence-based guidance. Our mission is to provide the most accurate tools for your wellness journey.
              </p>
              <div className="flex items-center gap-4">
                <a href="mailto:support@probmi.com" className="p-2 bg-zinc-50 rounded-full text-zinc-400 hover:text-emerald-500 transition-colors">
                  <Mail size={18} />
                </a>
                <a href="#" className="p-2 bg-zinc-50 rounded-full text-zinc-400 hover:text-emerald-500 transition-colors">
                  <Heart size={18} />
                </a>
              </div>
            </div>

            {/* Calculators Column */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-6">BMI Tools</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Standard BMI', href: '#' },
                  { label: 'BMI Prime', href: '#' },
                  { label: 'Ponderal Index', href: '#' },
                  { label: 'Child BMI', href: '#' },
                  { label: 'Athlete BMI', href: '#' }
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors flex items-center gap-2">
                      <ArrowRight size={12} className="text-zinc-300" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Resources Column */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-6">Resources</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Health Blog', href: '#blog' },
                  { label: 'Health Risks', href: '#risks' },
                  { label: 'Nutrition Basics', href: '#' },
                  { label: 'Fitness Strategies', href: '#' },
                  { label: 'Scientific References', href: '#' }
                ].map((item) => (
                  <li key={item.label}>
                    <a href={item.href} className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors flex items-center gap-2">
                      <ArrowRight size={12} className="text-zinc-300" />
                      {item.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h4 className="text-sm font-bold uppercase tracking-widest text-zinc-900 mb-6">Legal & Trust</h4>
              <ul className="space-y-4">
                {[
                  { label: 'Privacy Policy', icon: ShieldCheck, id: 'privacy' },
                  { label: 'Terms of Service', icon: ExternalLink, id: 'terms' },
                  { label: 'Cookie Policy', icon: ShieldCheck, id: 'cookies' },
                  { label: 'Medical Disclaimer', icon: AlertCircle, id: 'disclaimer' }
                ].map((item) => (
                  <li key={item.label}>
                    <button 
                      onClick={() => setActiveLegalPage(item.id as any)}
                      className="text-sm text-zinc-500 hover:text-emerald-600 transition-colors flex items-center gap-2 text-left w-full"
                    >
                      <item.icon size={14} className="text-zinc-300" />
                      {item.label}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Medical Disclaimer Section */}
          <div className="border-t border-zinc-100 pt-12 pb-8">
            <div className="bg-zinc-50 rounded-2xl p-6 md:p-8 border border-zinc-100">
              <div className="flex flex-col md:flex-row gap-6 items-start">
                <div className="p-3 bg-white rounded-xl shadow-sm border border-zinc-100 shrink-0">
                  <AlertCircle className="text-amber-500" size={24} />
                </div>
                <div className="space-y-2">
                  <h5 className="text-sm font-bold text-zinc-900">Medical Disclaimer</h5>
                  <p className="text-xs text-zinc-500 leading-relaxed">
                    The information provided by Accurate BMI Calculator is for educational and informational purposes only and is not intended as medical advice. 
                    Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. 
                    Never disregard professional medical advice or delay in seeking it because of something you have read on this website. 
                    Calculations are based on standard formulas and should be used as a general guide only.
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="flex flex-col md:flex-row justify-between items-center gap-6 pt-8 border-t border-zinc-100">
            <p className="text-xs text-zinc-400">
              &copy; {new Date().getFullYear()} Accurate BMI Calculator. All rights reserved. Built for health awareness.
            </p>
            <div className="flex items-center gap-6">
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={12} /> SSL Secured
              </span>
              <span className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-2">
                <Heart size={12} /> Made with Care
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function App() {
  return (
    <HelmetProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<BmiApp />} />
          <Route path="/blog/:blogId" element={<BmiApp />} />
        </Routes>
      </BrowserRouter>
    </HelmetProvider>
  );
}
