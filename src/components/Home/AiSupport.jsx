import React, { useRef } from "react";
// eslint-disable-next-line no-unused-vars
import { motion, useInView } from "framer-motion";
import { BiEdit } from "react-icons/bi";
import { SiGoogletranslate } from "react-icons/si";
import { MdOutlineSummarize } from "react-icons/md";
import {  FaBrain } from "react-icons/fa";
import { useTheme } from "../../hooks/useTheme";
import { Link } from "react-router";

export function AiSupport() {
  const { isDark } = useTheme();
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  
  const aiFeatures = [
    {
      id: "summarize",
      title: "Text Summarization",
      description: "Condense lengthy content into concise summaries that capture key points",
      icon: <MdOutlineSummarize size={28} />,
      color: "#3498db"
    },
    {
      id: "translation",
      title: "Multi-language Translation",
      description: "Translate your notes into Arabic, French, Spanish and more languages",
      icon: <SiGoogletranslate size={28} />,
      color: "#2ecc71"
    },
    {
      id: "improve",
      title: "Content Enhancement",
      description: "Improve clarity, grammar, and style of your written content",
      icon: <BiEdit size={28} />,
      color: "#f39c12"
    },
  ];
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.6,
      },
    },
  };
  
  const itemVariants = {
    hidden: { opacity: 0, y: 100, scale: 0.9 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        duration: 0.8,
        ease: "easeOut"
      },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.7,
        ease: "easeOut"
      }
    }
  };
  
  return (
    <section className="py-20 px-4 md:px-8" ref={ref} id="ai-features">
      <div className="container mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true, margin: "-100px" }}
        >
          <div className="flex items-center justify-center mb-4">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              whileInView={{ scale: 1, rotate: 0 }}
              transition={{ duration: 0.8, type: "spring" }}
              viewport={{ once: true }}
            >
              <FaBrain className={`text-4xl text-green-500`} />
            </motion.div>
          </div>
          
          <motion.h2 
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className={`text-3xl md:text-4xl font-bold mb-4 ${isDark ? "text-white" : "text-gray-800"}`}
          >
            Your AI Writing Journey Begins
          </motion.h2>
          
          <motion.p 
            variants={titleVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className={`text-lg max-w-3xl mx-auto ${isDark ? "text-amber-50" : "text-gray-600"}`}
          >
            Discover how our intelligent AI tools transform your writing process and unlock new creative possibilities
          </motion.p>
        </motion.div>
        
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
          className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-3 gap-10 md:gap-16"
        >
          {aiFeatures.map((feature, index) => (
            <motion.div 
              key={feature.id} 
              variants={itemVariants}
              custom={index}
              className="h-full"
            >
              <motion.div 
                whileHover={{ 
                  y: -10,
                  boxShadow: isDark ? "0 20px 25px -5px rgba(0, 0, 0, 0.3)" : "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                  transition: { type: "spring", stiffness: 300 }
                }}
                className={`h-full p-8 rounded-xl shadow-lg border relative overflow-hidden ${
                  isDark 
                    ? "bg-gray-800/50 border-gray-700" 
                    : "bg-white border-gray-100"
                }`}
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ delay: index * 0.3 + 0.3, duration: 0.5 }}
                  viewport={{ once: true }}
                  className="absolute top-0 right-0 w-24 h-24 -mt-10 -mr-10 rounded-full opacity-10"
                  style={{ backgroundColor: feature.color }}
                />
                
                <motion.div
                  whileHover={{ scale: 1.2, rotate: 5 }}
                  className="mb-5 inline-block p-3 rounded-full relative z-10"
                  style={{ 
                    backgroundColor: `${feature.color}20`,
                    color: feature.color 
                  }}
                >
                  {feature.icon}
                </motion.div>
                
                <motion.h3 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.3 + 0.2, duration: 0.5 }}
                  viewport={{ once: true }}
                  className={`text-xl font-semibold mb-3 ${isDark ? "text-white" : "text-gray-800"}`}
                >
                  {feature.title}
                </motion.h3>
                
                <motion.p 
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  transition={{ delay: index * 0.3 + 0.4, duration: 0.6 }}
                  viewport={{ once: true }}
                  className={`${isDark ? "text-amber-50" : "text-gray-600"}`}
                >
                  {feature.description}
                </motion.p>
              </motion.div>
            </motion.div>
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.7 }}
          viewport={{ once: true, margin: "-50px" }}
          className="text-center mt-16"
        >
          <p className={`text-lg italic ${isDark ? "text-amber-100" : "text-gray-700"}`}>
            Transform your writing experience with the power of AI
          </p>
        </motion.div>
      </div>
    </section>
  );
}
