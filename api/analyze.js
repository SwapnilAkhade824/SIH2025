    const prompt = `
You are an expert kolam analyst with deep knowledge of South Indian traditional art forms. Analyze this kolam pattern image carefully and provide a detailed, accurate assessment.

IMPORTANT ANALYSIS GUIDELINES:
1. Count dots/points carefully - look for the grid structure that forms the foundation
2. Examine symmetry by identifying repeating patterns and mirror lines
3. Assess complexity based on the number of loops, intersections, and pattern density
4. Identify traditional elements like lotus petals, geometric shapes, or temple motifs
5. Base all numerical values on actual visual observation, not assumptions

Please analyze the image systematically and return a valid JSON response with this exact structure:

{
  "dotAnalysis": {
    "detected": <count visible dots/intersection points in the grid - typically 5-25 for most kolams>,
    "validated": <count of dots that are properly connected - usually 80-95% of detected>,
    "precision": <decimal between 0.75-0.98 based on line accuracy and dot alignment>
  },
  "symmetryAnalysis": {
    "type": "<identify: 'Radial' (central point), 'Bilateral' (mirror line), 'Rotational' (rotates around center), or 'Asymmetrical'>",
    "axisCount": <number of symmetry lines: 0 for asymmetrical, 1-2 for bilateral, 4-8 for radial>,
    "rotationAngle": <degrees: 90 for 4-fold, 60 for 6-fold, 45 for 8-fold, 0 for bilateral/asymmetrical>,
    "score": <decimal 0.6-0.95 based on how well symmetry is maintained>
  },
  "complexityAnalysis": {
    "level": "<'Beginner' (simple loops, <10 dots), 'Intermediate' (moderate patterns, 10-16 dots), 'Advanced' (intricate designs, >16 dots)>",
    "score": <integer 1-10: 1-3 simple, 4-6 moderate, 7-8 complex, 9-10 masterpiece>,
    "patternCount": <count distinct motifs/shapes: circles, petals, geometric forms>,
    "entropy": <decimal 1.0-3.5: 1.0-1.5 simple, 1.5-2.5 moderate, 2.5+ complex>
  },
  "mathematicalPrinciples": [
    "<Select 3-5 from: 'Dot Matrix Foundation', 'Continuous Line Drawing', 'Geometric Symmetry', 'Fractal Patterns', 'Golden Ratio Proportions', 'Tessellation Principles', 'Topological Loops', 'Angular Relationships'>",
  ],
  "culturalDescription": [
    "<Describe the kolam's traditional purpose - daily ritual, festival, welcome, protection>",
    "<Identify regional style - Tamil Nadu, Karnataka, Andhra Pradesh characteristics>",
    "<Explain symbolic meaning - prosperity, harmony, cosmic order, spiritual significance>",
    "<Historical context - ancient tradition, temple art, household practice>",
    "<Materials traditionally used - rice flour, chalk powder, colored sand>",
    "<Time of creation - dawn ritual, festival preparation, special occasions>"
  ],
  "patternDetails": {
    "traditionalName": "<If recognizable: 'Padi Kolam', 'Pulli Kolam', 'Sikku Kolam', 'Kambi Kolam', or 'Contemporary Design'>",
    "region": "<Most likely: 'Tamil Nadu', 'Karnataka', 'Andhra Pradesh', 'Kerala', or 'Pan-South Indian'>",
    "difficulty": "<Realistic time: '15-30 minutes' (simple), '45-90 minutes' (moderate), '2-4 hours' (complex)>",
    "authenticity": "<'High' (traditional patterns), 'Medium' (modern interpretation), 'Low' (contemporary fusion)>"
  }
}

CRITICAL INSTRUCTIONS:
- Count actual visible elements, don't estimate
- If the image is unclear or not a kolam, indicate this in the analysis
- Use realistic numbers based on what you can observe
- Provide meaningful cultural insights, not generic statements
- Ensure all JSON syntax is valid with proper quotes and commas
