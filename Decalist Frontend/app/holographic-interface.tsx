'use client'

import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Upload, Tag, BarChart, DollarSign, Loader, Zap, Search } from 'lucide-react'
import { analyzeImage } from './actions'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"

interface AnalysisResult {
  features: string[];
  brandInfo: {
    popularity: number;
    perception: number;
    priceTier: 'budget' | 'mid-range' | 'premium' | 'luxury';
  };
  price: string;
}

export default function HolographicAIClothingPricePredictor() {
  const [image, setImage] = useState<string | null>(null)
  const [analyzing, setAnalyzing] = useState(false)
  const [result, setResult] = useState<AnalysisResult | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [progress, setProgress] = useState(0)

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => setImage(e.target?.result as string)
      reader.readAsDataURL(file)
    }
  }

  const handleAnalyze = async () => {
    if (!image) return

    setAnalyzing(true)
    setResult(null)
    setProgress(0)

    const formData = new FormData()
    formData.append('image', image)

    try {
      const analysisResult = await analyzeImage(formData)
      setResult(analysisResult)
    } catch (error) {
      console.error('Error analyzing image:', error)
    } finally {
      setAnalyzing(false)
    }
  }

  useEffect(() => {
    if (analyzing) {
      const interval = setInterval(() => {
        setProgress(prev => (prev < 100 ? prev + 1 : 100))
      }, 30)
      return () => clearInterval(interval)
    }
  }, [analyzing])

  return (
    <div className="min-h-screen bg-black text-cyan-400 p-8 flex flex-col items-center justify-center overflow-hidden">
      <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
      <motion.h1 
        className="text-5xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Holographic AI Price Predictor
      </motion.h1>
      
      <div className="w-full max-w-4xl bg-black bg-opacity-50 border border-cyan-500 rounded-3xl p-8 shadow-2xl relative">
        <div className="absolute inset-0 bg-grid-pattern opacity-10 rounded-3xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
          <motion.div 
            className="col-span-1"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="mb-6">
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="w-full h-64 rounded-2xl border-2 border-cyan-500 bg-black bg-opacity-50 hover:bg-opacity-70 transition-all duration-300 flex flex-col items-center justify-center group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
                <Upload className="w-16 h-16 mb-4 text-cyan-400 group-hover:scale-110 transition-transform duration-300 relative z-10" />
                <span className="text-lg text-cyan-300 group-hover:text-cyan-200 transition-colors duration-300 relative z-10">Upload Hologram</span>
              </Button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
              />
            </div>
            {image && (
              <motion.div 
                className="relative mb-6 h-64 rounded-2xl overflow-hidden"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <img
                  src={image}
                  alt="Uploaded clothing item"
                  className="w-full h-full object-cover"
                />
                {analyzing && (
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-30"
                    animate={{ x: ['-100%', '100%'] }}
                    transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                  />
                )}
                {analyzing && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    animate={{ rotate: [0, 360] }}
                    transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                  >
                    <div className="w-32 h-32 border-4 border-cyan-500 rounded-full border-t-transparent"></div>
                  </motion.div>
                )}
              </motion.div>
            )}
            <Button
              onClick={handleAnalyze}
              disabled={!image || analyzing}
              className="w-full rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-600 hover:to-blue-700 transition-all duration-300 text-lg py-6 font-semibold relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-grid-pattern opacity-20"></div>
              {analyzing ? (
                <div className="flex items-center relative z-10">
                  <Loader className="mr-2 h-5 w-5 animate-spin" />
                  Analyzing Hologram...
                </div>
              ) : (
                <div className="flex items-center relative z-10">
                  <Zap className="mr-2 h-5 w-5" />
                  Analyze Hologram
                </div>
              )}
            </Button>
          </motion.div>

          <motion.div 
            className="col-span-1 space-y-6"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <AnimatePresence mode="wait">
              {analyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-cyan-900 bg-opacity-20 rounded-2xl p-6"
                >
                  <h2 className="text-2xl font-semibold mb-4">Hologram Analysis in Progress</h2>
                  <Progress value={progress} className="h-2 mb-2" />
                  <p className="text-sm text-cyan-200">{progress}% Complete</p>
                </motion.div>
              ) : result ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-cyan-900 bg-opacity-20 rounded-2xl p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Extracted Features</h2>
                    <div className="flex flex-wrap gap-2">
                      {result.features.map((feature, index) => (
                        <motion.span 
                          key={index} 
                          className="bg-cyan-500 bg-opacity-50 text-white px-3 py-1 rounded-full text-sm flex items-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{ delay: index * 0.1 }}
                        >
                          <Tag className="w-4 h-4 mr-2" />
                          {feature}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                  <div className="bg-cyan-900 bg-opacity-20 rounded-2xl p-6 mb-6">
                    <h2 className="text-2xl font-semibold mb-4">Brand Information</h2>
                    <div className="space-y-4">
                      <div>
                        <span className="font-medium text-lg">Popularity:</span>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 0.5, duration: 0.8 }}
                        >
                          <Progress value={result.brandInfo.popularity} className="mt-2" />
                        </motion.div>
                      </div>
                      <div>
                        <span className="font-medium text-lg">Perception:</span>
                        <motion.div
                          initial={{ width: 0 }}
                          animate={{ width: '100%' }}
                          transition={{ delay: 0.7, duration: 0.8 }}
                        >
                          <Progress value={result.brandInfo.perception} className="mt-2" />
                        </motion.div>
                      </div>
                      <div>
                        <span className="font-medium text-lg">Price Tier:</span> 
                        <span className="ml-2 text-lg capitalize">{result.brandInfo.priceTier}</span>
                      </div>
                    </div>
                  </div>
                  <motion.div 
                    className="bg-gradient-to-r from-cyan-400 to-blue-500 rounded-2xl p-6 text-center"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.8, type: 'spring', stiffness: 100 }}
                  >
                    <h2 className="text-2xl font-semibold mb-2">Predicted Price</h2>
                    <div className="text-6xl font-bold flex items-center justify-center">
                      <DollarSign className="w-12 h-12 mr-2" />
                      {result.price}
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.div
                  key="instructions"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                  className="bg-cyan-900 bg-opacity-20 rounded-2xl p-6 text-center"
                >
                  <Zap className="w-16 h-16 mx-auto mb-4 text-cyan-400" />
                  <h2 className="text-2xl font-semibold mb-2">Holographic AI Analysis</h2>
                  <p className="text-cyan-200">
                    Upload a hologram of a clothing item and let our AI analyze its features, brand information, and predict its price.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  )
}

