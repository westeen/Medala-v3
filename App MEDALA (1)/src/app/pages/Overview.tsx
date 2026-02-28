import { Activity, TrendingUp, TrendingDown, Heart, Pill, Moon, FileText, AlertCircle, Minus, Apple, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';

interface HealthMetric {
  value: string;
  trend: 'up' | 'down' | 'stable';
  status: 'normal' | 'warning' | 'critical';
}

interface DailyCalorie {
  calories: number;
  protein: number;
  fat: number;
  carbohydrates: number;
}

interface HealthIndex {
  health_index: number;
}

interface FoodIndex {
  food_index: number;
}

interface AIInsights {
  summary: string;
}

export function Overview() {
  const [userName, setUserName] = useState('User');
  const [healthScore, setHealthScore] = useState(72);
  const [dailyCalorie, setDailyCalorie] = useState<DailyCalorie | null>(null);
  const [healthIndex, setHealthIndex] = useState<HealthIndex | null>(null);
  const [foodIndex, setFoodIndex] = useState<FoodIndex | null>(null);
  const [aiInsights, setAiInsights] = useState<AIInsights | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const profile = localStorage.getItem('medala_profile');
    if (profile) {
      const data = JSON.parse(profile);
      setUserName(data.firstName || 'User');
    }
  }, []);

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        setLoading(true);
        setError(null);
        const [calorieRes, healthRes, foodRes, insightsRes] = await Promise.all([
          fetch('http://localhost:8000/daily_calorie'),
          fetch('http://localhost:8000/health_index'),
          fetch('http://localhost:8000/food_index'),
          fetch('http://localhost:8000/ai_insights'),
        ]);

        if (calorieRes.ok) {
          const calorieData = await calorieRes.json();
          console.log('Calorie data:', calorieData);
          setDailyCalorie(calorieData);
        } else {
          console.error('Calorie fetch failed:', calorieRes.status);
        }

        if (healthRes.ok) {
          const healthData = await healthRes.json();
          console.log('Health index data:', healthData);
          setHealthIndex(healthData);
          // Update health score based on health index
          if (healthData.health_index) {
            setHealthScore(Math.round(healthData.health_index * 10));
          }
        } else {
          console.error('Health index fetch failed:', healthRes.status);
        }

        if (foodRes.ok) {
          const foodData = await foodRes.json();
          console.log('Food index data:', foodData);
          setFoodIndex(foodData);
        } else {
          console.error('Food index fetch failed:', foodRes.status);
        }

        if (insightsRes.ok) {
          const insightsData = await insightsRes.json();
          console.log('AI insights data:', insightsData);
          setAiInsights(insightsData);
        } else {
          console.error('AI insights fetch failed:', insightsRes.status);
        }
      } catch (error) {
        console.error('Error fetching metrics:', error);
        setError('Failed to fetch metrics. Please check the backend server.');
      } finally {
        setLoading(false);
      }
    };

    fetchMetrics();
    // Refresh every 1 hour
    const interval = setInterval(fetchMetrics, 60 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const metrics = {
    dailyCalories: { 
      value: dailyCalorie?.calories ? `${Math.round(dailyCalorie.calories)}` : '0', 
      trend: 'stable' as const, 
      status: 'normal' as const 
    },
    protein: { 
      value: dailyCalorie?.protein ? `${Math.round(dailyCalorie.protein)}` : '0', 
      trend: 'stable' as const, 
      status: 'normal' as const 
    },
    fat: { 
      value: dailyCalorie?.fat ? `${Math.round(dailyCalorie.fat)}` : '0', 
      trend: 'stable' as const, 
      status: 'normal' as const 
    },
    carbs: { 
      value: dailyCalorie?.carbohydrates ? `${Math.round(dailyCalorie.carbohydrates)}` : '0', 
      trend: 'stable' as const, 
      status: 'normal' as const 
    },
  };

  const getTimeGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good Morning';
    if (hour < 18) return 'Good Afternoon';
    return 'Good Evening';
  };

  const getRiskColor = (score: number) => {
    if (score >= 80) return 'from-green-50 to-emerald-50 border-green-200';
    if (score >= 60) return 'from-orange-50 to-amber-50 border-orange-200';
    return 'from-red-50 to-pink-50 border-red-200';
  };

  const getRiskBadge = (score: number) => {
    if (score >= 80) return { text: 'Good', color: 'bg-green-100 text-green-700' };
    if (score >= 60) return { text: 'Monitor', color: 'bg-orange-100 text-orange-700' };
    return { text: 'Critical', color: 'bg-red-100 text-red-700' };
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-orange-600';
    return 'text-red-600';
  };

  const getTrendIcon = (trend: 'up' | 'down' | 'stable', status: string) => {
    if (trend === 'stable') return <Minus className="w-5 h-5 text-gray-500" />;
    if (trend === 'up') {
      return status === 'critical' || status === 'warning' ? 
        <TrendingUp className="w-5 h-5 text-red-500" /> : 
        <TrendingUp className="w-5 h-5 text-green-500" />;
    }
    return status === 'critical' || status === 'warning' ? 
      <TrendingDown className="w-5 h-5 text-red-500" /> : 
      <TrendingDown className="w-5 h-5 text-green-500" />;
  };

  const getMetricCardBorder = (status: string) => {
    if (status === 'critical') return 'border-2 border-red-300';
    if (status === 'warning') return 'border border-orange-300';
    return 'border border-gray-200';
  };

  const getMetricStatusBadge = (status: string) => {
    if (status === 'critical') return { text: 'Critical', color: 'bg-red-100 text-red-700' };
    if (status === 'warning') return { text: 'Warning', color: 'bg-orange-100 text-orange-700' };
    return { text: 'Normal', color: 'bg-green-100 text-green-700' };
  };

  const riskBadge = getRiskBadge(healthScore);

  return (
    <div className="p-4 md:p-8">
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-700 font-medium">{error}</p>
        </div>
      )}

      {/* Header */}
      <div className="mb-6 md:mb-8">
        <h1 className="text-3xl md:text-4xl mb-2">{getTimeGreeting()}, {userName}</h1>
        <p className="text-gray-600">Your clinical health overview</p>
      </div>

      {/* Health Stability Score */}
      <div className={`bg-gradient-to-br ${getRiskColor(healthScore)} rounded-2xl p-6 md:p-8 mb-6 md:mb-8 border-2`}>
        <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
          <div className="flex-1">
            <div className="text-gray-700 mb-2 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              <span className="font-medium">Health Stability Score</span>
            </div>
            <div className="flex items-baseline gap-2 mb-4">
              <span className={`text-5xl md:text-6xl font-semibold ${getScoreColor(healthScore)}`}>{healthScore}</span>
              <span className="text-xl md:text-2xl text-gray-500">/100</span>
            </div>
            <div className={`inline-flex px-4 py-1 ${riskBadge.color} rounded-full text-sm font-medium`}>
              {riskBadge.text}
            </div>
          </div>
          <div className={`w-24 h-24 md:w-32 md:h-32 rounded-full bg-white border-8 ${
            healthScore >= 80 ? 'border-green-200' : 
            healthScore >= 60 ? 'border-orange-200' : 
            'border-red-200'
          } flex items-center justify-center`}>
            <Activity className={`w-12 h-12 md:w-16 md:h-16 ${getScoreColor(healthScore)}`} />
          </div>
        </div>

        {/* Risk Indicator Bar */}
        <div className="mt-6 bg-white/50 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full transition-all ${
              healthScore >= 80 ? 'bg-green-500' :
              healthScore >= 60 ? 'bg-orange-500' :
              'bg-red-500'
            }`}
            style={{ width: `${healthScore}%` }}
          />
        </div>
      </div>

      {/* Nutrition Metrics Tabs */}
      <div className="mb-6 md:mb-8">
        <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-700">
            <span className="font-semibold">Current Data:</span> Calories: {dailyCalorie?.calories || 0}, Protein: {dailyCalorie?.protein || 0}, Fat: {dailyCalorie?.fat || 0}, Carbs: {dailyCalorie?.carbohydrates || 0}
          </p>
        </div>
        <Tabs defaultValue="calories" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-6">
            <TabsTrigger value="calories">Calories</TabsTrigger>
            <TabsTrigger value="protein">Protein</TabsTrigger>
            <TabsTrigger value="fat">Fat</TabsTrigger>
            <TabsTrigger value="carbs">Carbs</TabsTrigger>
          </TabsList>

          {/* Calories Tab */}
          <TabsContent value="calories">
            <div className={`bg-white rounded-xl p-6 md:p-8 ${getMetricCardBorder(metrics.dailyCalories.status)}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                    <Activity className="w-5 h-5" />
                    <span className="font-medium">Daily Caloric Intake</span>
                  </div>
                  <div className="text-5xl md:text-6xl font-bold text-orange-600 mb-2">
                    {loading ? '-' : metrics.dailyCalories.value}
                  </div>
                  <div className="text-lg text-gray-600 mb-4">kcal</div>
                </div>
                <div className="text-right">
                  {getTrendIcon(metrics.dailyCalories.trend, metrics.dailyCalories.status)}
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    getMetricStatusBadge(metrics.dailyCalories.status).color
                  } mt-2`}>
                    {getMetricStatusBadge(metrics.dailyCalories.status).text}
                  </span>
                </div>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-200">
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Recommended Daily Intake:</span> 2000-2500 kcal (varies by age, gender, and activity level)
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Protein Tab */}
          <TabsContent value="protein">
            <div className={`bg-white rounded-xl p-6 md:p-8 ${getMetricCardBorder(metrics.protein.status)}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                    <Heart className="w-5 h-5" />
                    <span className="font-medium">Protein Intake</span>
                  </div>
                  <div className="text-5xl md:text-6xl font-bold text-red-600 mb-2">
                    {loading ? '-' : metrics.protein.value}
                  </div>
                  <div className="text-lg text-gray-600 mb-4">g</div>
                </div>
                <div className="text-right">
                  {getTrendIcon(metrics.protein.trend, metrics.protein.status)}
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    getMetricStatusBadge(metrics.protein.status).color
                  } mt-2`}>
                    {getMetricStatusBadge(metrics.protein.status).text}
                  </span>
                </div>
              </div>
              <div className="bg-red-50 rounded-lg p-4 border border-red-200">
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Daily Target:</span> 0.8-1.0g per kg of body weight (adjust based on fitness goals)
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Fat Tab */}
          <TabsContent value="fat">
            <div className={`bg-white rounded-xl p-6 md:p-8 ${getMetricCardBorder(metrics.fat.status)}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                    <Apple className="w-5 h-5" />
                    <span className="font-medium">Fat Intake</span>
                  </div>
                  <div className="text-5xl md:text-6xl font-bold text-yellow-600 mb-2">
                    {loading ? '-' : metrics.fat.value}
                  </div>
                  <div className="text-lg text-gray-600 mb-4">g</div>
                </div>
                <div className="text-right">
                  {getTrendIcon(metrics.fat.trend, metrics.fat.status)}
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    getMetricStatusBadge(metrics.fat.status).color
                  } mt-2`}>
                    {getMetricStatusBadge(metrics.fat.status).text}
                  </span>
                </div>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-200">
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Recommended Daily Intake:</span> 44-77g (about 20-35% of daily calories)
                </p>
              </div>
            </div>
          </TabsContent>

          {/* Carbs Tab */}
          <TabsContent value="carbs">
            <div className={`bg-white rounded-xl p-6 md:p-8 ${getMetricCardBorder(metrics.carbs.status)}`}>
              <div className="flex justify-between items-start mb-6">
                <div>
                  <div className="text-gray-600 text-sm mb-2 flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    <span className="font-medium">Carbohydrate Intake</span>
                  </div>
                  <div className="text-5xl md:text-6xl font-bold text-green-600 mb-2">
                    {loading ? '-' : metrics.carbs.value}
                  </div>
                  <div className="text-lg text-gray-600 mb-4">g</div>
                </div>
                <div className="text-right">
                  {getTrendIcon(metrics.carbs.trend, metrics.carbs.status)}
                  <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${
                    getMetricStatusBadge(metrics.carbs.status).color
                  } mt-2`}>
                    {getMetricStatusBadge(metrics.carbs.status).text}
                  </span>
                </div>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                <p className="text-gray-700 text-sm">
                  <span className="font-semibold">Recommended Daily Intake:</span> 225-325g (about 45-65% of daily calories)
                </p>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* AI Insights Section */}
      <div className="bg-white rounded-2xl p-8 border border-gray-200">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center">
            <Zap className="w-6 h-6 text-white" />
          </div>
          <h2 className="text-2xl font-semibold">AI Insights</h2>
        </div>

        {/* AI Insights Summary */}
        <div className="bg-gradient-to-br from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-lg p-6 mb-6">
          <div className="flex gap-3 items-start">
            <Zap className="w-6 h-6 text-emerald-600 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h3 className="font-semibold text-emerald-900 mb-3 text-lg">Your Health Analysis</h3>
              <p className="text-gray-800 leading-relaxed">
                {loading ? 'Analyzing your health data...' : (aiInsights?.summary || 'No insights available yet. Keep logging your meals and activities.')}
              </p>
              <p className="text-xs text-gray-600 mt-4">AI-powered insights based on your logged data</p>
            </div>
          </div>
        </div>

        {/* Data Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Today's Calories</p>
            <p className="text-2xl font-bold text-orange-600">{loading ? '-' : Math.round(dailyCalorie?.calories || 0)}</p>
            <p className="text-xs text-gray-500 mt-1">kcal</p>
          </div>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Protein Intake</p>
            <p className="text-2xl font-bold text-red-600">{loading ? '-' : Math.round(dailyCalorie?.protein || 0)}</p>
            <p className="text-xs text-gray-500 mt-1">g</p>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-gray-600 mb-1">Nutrition Balance</p>
            <p className="text-2xl font-bold text-blue-600">{loading ? '-' : Math.round(dailyCalorie?.carbohydrates || 0)}</p>
            <p className="text-xs text-gray-500 mt-1">g carbs</p>
          </div>
        </div>

        {/* Recommended Actions */}
        <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-5">
          <h3 className="font-semibold text-emerald-900 mb-3">Next Steps</h3>
          <div className="space-y-2">
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 text-sm">→</span>
              <p className="text-gray-700 text-sm">Log your meals daily to get more accurate and personalized health insights</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 text-sm">→</span>
              <p className="text-gray-700 text-sm">Upload lab results to enhance your health profile and receive better recommendations</p>
            </div>
            <div className="flex items-start gap-2">
              <span className="text-emerald-600 text-sm">→</span>
              <p className="text-gray-700 text-sm">Track your mood and activities using the Log Entry section for comprehensive insights</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}