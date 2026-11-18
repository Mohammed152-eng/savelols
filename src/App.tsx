/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useRef, useEffect } from 'react';
import { ChevronDown, Loader2, Search, Download, FileText, CheckCircle2, AlertCircle, Layers, ExternalLink, Eye, EyeOff, Sparkles, Check } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import JSZip from 'jszip';

const SUBJECTS = [
  {
    code: 'Biology 0610',
    topics: [
      'Characteristics, Classification & Features of Organisms',
      'Cell Structure & Size of Specimens',
      'Diffusion, Osmosis & Active Transport',
      'Biological Molecules',
      'Enzymes',
      'Photosynthesis & Leaf Structure',
      'Human Diet & Digestion',
      'Transport in Plants',
      'Circulatory Systems, Heart & Blood Vessels',
      'Diseases & Immunity',
      'Gas Exchange in Humans',
      'Respiration',
      'Excretion in Humans',
      'Coordination, Response & Homeostasis',
      'Drugs in Medicine',
      'Reproduction in Plants & Humans',
      'Inheritance, Genes & Cell Division',
      'Variation & Natural Selection',
      'Energy & Feeding Relationships',
      'Human Impact: Biodiversity, Pollution & Conservation',
      'Biotechnology & Genetic Modification'
    ]
  },
  {
    code: 'Chemistry 0620',
    topics: [
      'Solids, liquids & gases',
      'Atomic Structure & the Periodic Table',
      'Ions & Ionic Bonds',
      'Simple Molecules & Covalent Bonds',
      'Giant Structures',
      'Formulae & Relative Masses',
      'The Mole & the Avogadro Constant',
      'Electrolysis',
      'Applications of Electrolysis',
      'Exothermic & Endothermic Reactions',
      'Chemical Change & Rate of Reaction',
      'Reversible Reactions & Equilibrium',
      'Redox',
      'The Characteristic Properties of Acids & Bases',
      'Preparation of Salts',
      'The Periodic Table & Trends',
      'Group Properties & Trends',
      'Properties, Uses & Alloys of Metals',
      'Reactivity Series & Corrosion of Metals',
      'Extraction of Metals',
      'Water & Water Pollution',
      'Air Quality & Climate',
      'Formulae, Functional Groups & Terminology',
      'Organic Families',
      'Experimental Techniques',
      'Separation & Purification'
    ]
  },
  {
    code: 'Math 0580',
    topics: [
      'Number Toolkit',
      'Set Notation & Venn Diagrams',
      'Prime Factors, HCF & LCM',
      'Powers, Roots & Standard Form',
      'Fractions Toolkit',
      'Percentages Toolkit',
      'Simple & Compound Interest, Growth & Decay',
      'Surds',
      'Working with FDP',
      'Working with Ratios',
      'Compound Measures (Speed, Density, Pressure)',
      'Time, Currency & Conversions',
      'Rounding, Estimation & Bounds',
      'Using a Calculator',
      'Algebra Toolkit',
      'Algebraic Roots & Indices',
      'Expanding & Factorising Brackets',
      'Linear Equations & Inequalities',
      'Quadratic Equations',
      'Rearranging Formulas',
      'Simultaneous Equations',
      'Algebraic Fractions',
      'Forming & Solving Equations',
      'Functions',
      'Sequences',
      'Proportion',
      'Coordinate Geometry',
      'Linear Graphs',
      'Quadratic Graphs',
      'Further Graphs & Tangents',
      'Solving & Graphing Inequalities',
      'Real-Life Graphs',
      'Differentiation',
      'Geometry Toolkit',
      'Angles in Polygons & Parallel Lines',
      'Bearings, Constructions & Scale Drawings',
      'Circle Theorems',
      'Area & Perimeter',
      'Circles, Arcs & Sectors',
      'Volume & Surface Area',
      'Congruence & Similarity',
      'Right-Angled Triangles (Pythagoras & Trigonometry)',
      'Sine, Cosine Rules & Area of Triangles',
      '3D Pythagoras & Trigonometry',
      'Trigonometric Graphs & Equations',
      'Vectors',
      'Transformations',
      'Basic Probability',
      'Probability Diagrams (Tree & Venn Diagrams)',
      'Conditional Probability',
      'Averages & Range',
      'Histograms',
      'Cumulative Frequency',
      'Scatter Graphs & Correlation'
    ]
  },
  {
    code: 'English 0510',
    topics: [
      'Paper 1: Reading',
      'Question 1: Comprehension',
      'Question 1: Summary',
      'Question 2: Short-Answer Questions',
      'Question 2: Language Task',
      'Question 3: Extended Response',
      'Paper 2',
      'Section A: Directed Writing',
      'Section B: Composition',
      'Coursework',
      'Assignment 1',
      'Assignment 2',
      'Assignment 3'
    ]
  },
  {
    code: 'Physics 0625',
    topics: [
      'Physical Quantities & Measurement Techniques',
      'Motion',
      'Mass, Weight & Density',
      'Effects of Forces',
      'Moments',
      'Momentum',
      'Energy, Work & Power',
      'Energy Sources',
      'Pressure',
      'Kinetic Particle Model of Matter',
      'Thermal Properties & Temperature',
      'Transfer of Thermal Energy',
      'General Properties of Waves',
      'Light',
      'Electromagnetic Spectrum',
      'Sound',
      'Simple Phenomena of Magnetism',
      'Electrical Quantities',
      'Electric Circuits & Electrical Safety',
      'Electromagnetic Effects',
      'The Nuclear Model of the Atom',
      'Radioactivity',
      'Earth & The Solar System',
      'Stars & The Universe'
    ]
  },
  {
    code: 'ICT 0417',
    topics: [
      'Hardware & Software',
      'Components of Computer Systems',
      'Types of Computer & Emerging Technologies',
      'Networks',
      'Network Issues',
      'Effects of Using IT',
      'ICT Applications',
      'The Systems Life Cycle',
      'Safety',
      'Security',
      'Communication',
      'Manage Files Effectively',
      'Compression',
      'Audience & Purpose',
      'Document Production',
      'Images',
      'Proofing',
      'Create a Database Structure',
      'Spreadsheets',
      'HTML in the Content Layer',
      'CSS in the Presentation Layer',
      'Presentations'
    ]
  },
  {
    code: 'Computer Science 0478',
    topics: [
      'Number Systems',
      'Text, Sound & Images',
      'Data Storage & Compression',
      'Types & Methods of Data Transmission',
      'Methods of Error Detection',
      'Encryption',
      'Computer Architecture',
      'Input & Output Devices',
      'Data Storage',
      'Network Hardware',
      'Types of Software & Interrupts',
      'Types of Programming Language, Translators & Integrated Development Environments (IDEs)',
      'The Internet & the World Wide Web',
      'Digital Currency',
      'Cyber Security',
      'Automated Systems',
      'Robotics',
      'Artificial Intelligence',
      'Development Life Cycle',
      'Computer Sub-Systems',
      'Algorithms',
      'Standard Methods of a Solution',
      'Validation & Verification',
      'Identifying Errors',
      'Programming Concepts',
      'Arrays',
      'File Handling',
      'SQL',
      'The Exam Papers',
      'Structuring Your Responses'
    ]
  },
  {
    code: 'Business 0450',
    topics: [
      '1.1 Business Activity',
      '1.2 Classification of Businesses',
      '1.3 Enterprise & Business Growth',
      '1.4 Types of Businesses',
      '1.5 Business & Stakeholder Objectives',
      '2.1 Motivating Employees',
      '2.2 Organisation & People Management',
      '2.3 Recruitment, Selection & Training',
      '2.4 Internal & External Communication',
      '3.1 Customers, Marketing & Competition',
      '3.2 Market Research',
      '3.3 The Marketing Mix',
      '3.4 Marketing Strategy',
      '4.1 Production of Goods & Services',
      '4.2 Costs, Break-Even & Production Scale',
      '4.3 Quality Management',
      '4.4 Location Decisions',
      '5.1 Business Finance',
      '5.2 Cash-Flow Forecasts & Working Capital',
      '5.3 Income Statements',
      '5.4 Statement of Financial Position',
      '6.1 Economic Issues',
      '6.2 Environmental & Ethical Issues',
      '6.3 Business & Globalisation',
      '7.1 The Exam Papers',
      '7.2 Business Exam Skills',
      '7.3 Structuring Your Responses'
    ]
  },
  {
    code: 'Economics 0455',
    topics: [
      '1.1 The Nature of the Basic Economic Problem',
      '1.2 Factors of Production',
      '1.3 Opportunity Cost',
      '1.4 Production Possibility Curve (PPC) Diagrams',
      '2.1 The Role of Markets in Allocating Resources',
      '2.2 Demand',
      '2.3 Supply',
      '2.4 Price Determination',
      '2.5 Price Changes',
      '2.6 Price Elasticity of Demand (PED)',
      '2.7 Price Elasticity of Supply (PES)',
      '2.8 Market Economic System',
      '2.9 Market Failure',
      '2.10 Mixed Economic System',
      '3.1 Money & Banking',
      '3.2 Households',
      '3.3 Workers',
      '3.4 Firms',
      '3.5 Firms & Production',
      '3.6 Firms\' Costs, Revenue & Objectives',
      '3.7 Types of Markets',
      '4.1 Government Macroeconomic Intervention',
      '4.2 Fiscal Policy',
      '4.3 Monetary Policy',
      '4.4 Supply-Side Policy',
      '4.5 Economic Growth',
      '4.6 Employment & Unemployment',
      '4.7 Inflation',
      '5.1 Living Standards',
      '5.2 Poverty',
      '5.3 Population',
      '5.4 Differences in Economic Development Between Countries',
      '6.1 Specialisation & Free Trade',
      '6.2 Globalisation & Trade Restrictions',
      '6.3 Foreign Exchange Rates',
      '6.4 Current Account of the Balance of Payments',
      '7.2 Economics Exam Skills',
      '7.3 Structuring Your Responses'
    ]
  },
  {
    code: 'Accounting 0452',
    topics: [
      'The Purpose of Accounting',
      'Business Documents',
      'Books of Prime Entry',
      'Double Entry Book-keeping with Ledger Accounts',
      'The Cash & Petty Cash Books',
      'The Trial Balance & Correction of Errors',
      'Bank Reconciliation',
      'Control Accounts',
      'Capital & Revenue Expenditure & Receipts',
      'Depreciation & Disposal of Non-Current Assets',
      'Other Payables & Other Receivables',
      'Irrecoverable Debts & Provision for Doubtful Debts',
      'Valuation of Inventory',
      'Financial Statements for Sole Traders',
      'Financial Statements for Partnerships',
      'Financial Statements for Limited Companies',
      'Financial Statements for Clubs & Societies',
      'Financial Statements for Manufacturing Businesses',
      'Accounting Ratios',
      'Accounting Principles & Policies'
    ]
  },
  {
    code: 'Maths Pure 1 9709',
    topics: [
      'Quadratics',
      'Inequalities & Simultaneous Equations',
      'Functions',
      'Graphs of Functions',
      'Transformations of Functions',
      'Combinations of Transformations',
      'Modelling with Functions',
      'Equation of a Straight Line',
      'Circles',
      'Basic Trigonometry',
      'Trigonometric Functions',
      'Circular Measure (Radians)',
      'Trigonometric Equations',
      'Modelling with Trigonometric Functions',
      'Binomial Expansion',
      'Arithmetic Progressions',
      'Geometric Progressions',
      'Sequences & Series',
      'Differentiation',
      'Applications of Differentiation',
      'Integration',
      'Further Integration'
    ]
  },
  {
    code: 'Maths Pure 3 9709',
    topics: [
      'Modulus Functions',
      'Sketching Graphs of Modulus Functions',
      'Solving Equations with Modulus Functions',
      'Polynomials',
      'Partial Fractions',
      'Further Modelling with Functions',
      'General Binomial Expansion',
      'Logarithmic & Exponential Functions',
      'Laws of Logarithms',
      'Modelling with Logarithms & Exponentials',
      'Reciprocal Trigonometric Functions',
      'Compound & Double Angle Formulae',
      'Further Trigonometric Equations',
      'Trigonometric Proof',
      'Further Differentiation',
      'Implicit Differentiation',
      'Differentiation of Parametric Equations',
      'Further Integration',
      'Differential Equations',
      'Numerical Solutions of Equations',
      'Vectors in 3 Dimensions',
      'Vector Equations of Lines & The Scalar Product',
      'Argand Diagrams',
      'Further Complex Numbers'
    ]
  },
  {
    code: 'Maths Mechanics 9709',
    topics: [
      'Quantities, Units & Modelling',
      'Kinematics Graphs',
      'Variable Acceleration',
      'Constant Acceleration',
      'Forces',
      'Newton\'s Second Law',
      'Resolving Forces, Inclined Planes & Friction',
      'Work & Energy',
      'Power',
      'Momentum & Collisions'
    ]
  },
  {
    code: 'Maths Probability & Statistics 1 9709',
    topics: [
      'Statistical Measures',
      'Representation of Data',
      'Working with Data',
      'Basic Probability',
      'Permutations & Combinations',
      'Further Probability',
      'Probability Distributions',
      'Binomial & Geometric Distribution',
      'Normal Distribution',
      'Working with Distributions'
    ]
  },
  {
    code: 'Maths Probability & Statistics 2 9709',
    topics: [
      'Sampling & Data Collection',
      'Sampling & Estimation',
      'Poisson Distribution',
      'Linear Combinations of Random Variables',
      'Continuous Random Variables',
      'Working with Distributions',
      'Hypothesis Testing',
      'Hypothesis Testing (Binomial & Poisson Distributions)',
      'Hypothesis Testing (Normal Distribution)'
    ]
  },
  {
    code: 'Physics 9702',
    topics: [
      'Physical Quantities',
      'SI Units',
      'Errors & Uncertainties',
      'Scalars & Vectors',
      'Equations of Motion',
      'Momentum & Newton’s Laws of Motion',
      'Non-Uniform Motion',
      'Linear Momentum & its Conservation',
      'Turning Effects of Forces',
      'Equilibrium of Forces',
      'Density & Pressure',
      'Energy Conservation',
      'Gravitational Potential Energy & Kinetic Energy',
      'Stress & Strain',
      'Elastic & Plastic Behaviour',
      'Progressive Waves',
      'Transverse & Longitudinal Waves',
      'Doppler Effect for Sound Waves',
      'Electromagnetic Spectrum',
      'Polarisation',
      'Stationary Waves',
      'Diffraction',
      'Interference',
      'The Diffraction Grating',
      'Electric Current',
      'Potential Difference & Power',
      'Resistance & Resistivity',
      'Practical Circuits',
      'Kirchhoff’s Laws',
      'Potential Dividers',
      'Atoms, Nuclei & Radiation',
      'Fundamental Particles',
      'Kinematics of Uniform Circular Motion',
      'Centripetal Acceleration',
      'Gravitational Field',
      'Gravitational Force Between Point Masses',
      'Gravitational Field of a Point Mass',
      'Gravitational Potential',
      'Thermal Equilibrium',
      'Temperature Scales',
      'Specific Heat Capacity & Specific Latent Heat',
      'The Mole',
      'Equation of State',
      'Kinetic Theory of Gases',
      'Internal Energy',
      'The First Law of Thermodynamics',
      'Simple Harmonic Oscillations',
      'Energy in Simple Harmonic Motion',
      'Damped & Forced Oscillations, Resonance',
      'Electric Fields & Field Lines',
      'Uniform Electric Fields',
      'Electric Force Between Point Charges',
      'Electric Field of a Point Charge',
      'Electric Potential',
      'Capacitors & Capacitance',
      'Energy Stored in a Capacitor',
      'Discharging a Capacitor',
      'Concept of a Magnetic Field',
      'Force on a Current-Carrying Conductor',
      'Force on a Moving Charge',
      'Magnetic Fields Due to Currents',
      'Electromagnetic Induction',
      'Characteristics of Alternating Currents',
      'Rectification & Smoothing',
      'Energy & Momentum of a Photon',
      'Photoelectric Effect',
      'Wave-Particle Duality',
      'Energy Levels in Atoms & Line Spectra',
      'Mass Defect & Nuclear Binding Energy',
      'Radioactive Decay',
      'Production & Use of Ultrasound',
      'Production & Use of X-rays',
      'PET Scanning',
      'Standard Candles',
      'Stellar Radii',
      'Hubble’s Law & the Big Bang Theory'
    ]
  },
  {
    code: 'Chemistry 9701',
    topics: [
      'Particles in the Atom & Atomic Radius',
      'Isotopes',
      'Electrons, Energy Levels & Atomic Orbitals',
      'Ionisation Energy',
      'Relative Masses of Atoms & Molecules',
      'The Mole & the Avogadro Constant',
      'Formulas',
      'Reacting Masses & Volumes (of Solutions & Gases)',
      'Electronegativity & Bonding',
      'Ionic Bonding',
      'Metallic Bonding',
      'Covalent Bonding & Coordinate (Dative Covalent) Bonding',
      'Shapes of Molecules',
      'Intermolecular Forces, Electronegativity & Bond Properties',
      'Dot & Cross Diagrams',
      'The Gaseous State: Ideal & Real Gases & pV = nRT',
      'Bonding & Structure',
      'Enthalpy Change, ΔH',
      'Hess’s Law',
      'Redox Processes: Electron Transfer & Changes in Oxidation Number (Oxidation State)',
      'Chemical Equilibria: Reversible Reactions & Dynamic Equilibrium',
      'Brønsted–Lowry Theory of Acids & Bases',
      'Rate of Reaction',
      'Effect of Temperature on Reaction Rates & the Concept of Activation Energy',
      'Homogeneous & Heterogeneous Catalysts',
      'Periodicity of Physical Properties of the Elements in Period 3',
      'Periodicity of Chemical Properties of the Elements in Period 3',
      'Chemical Periodicity of Other Elements',
      'Similarities & Trends in the Properties of the Group 2 Metals, Magnesium to Barium, & Their Compounds',
      'Physical Properties of the Group 17 Elements',
      'The Chemical Properties of the Halogen Elements & the Hydrogen Halides',
      'Some Reactions of the Halide Ions',
      'The Reactions of Chlorine',
      'Nitrogen and Sulfur',
      'Formulas, Functional Groups & the Naming of Organic Compounds',
      'Characteristic Organic Reactions',
      'Shapes of Organic Molecules; σ & π Bonds',
      'Isomerism: Structural Isomerism & Stereoisomerism',
      'Alkanes',
      'Alkenes',
      'Halogenoalkanes',
      'Alcohols',
      'Aldehydes & Ketones',
      'Carboxylic Acids',
      'Esters',
      'Primary Amines',
      'Nitriles & Hydroxynitriles',
      'Addition Polymerisation',
      'Organic Synthesis',
      'Infrared Spectroscopy',
      'Mass Spectrometry',
      'Lattice Energy & Born–Haber Cycles',
      'Enthalpies of Solution & Hydration',
      'Entropy Change, ΔS',
      'Gibbs Free Energy Change, ΔG',
      'Electrolysis',
      'Standard Electrode Potentials Eθ, Standard Cell Potentials Eθcell & the Nernst Equation',
      'Acids & Bases',
      'Partition Coefficients',
      'Simple Rate Equations, Orders of Reaction & Rate Constants',
      'General Physical & Chemical Properties of the First Row of Transition Elements, Titanium to Copper',
      'General Characteristic Chemical Properties of the First Set of Transition Elements, Titanium to Copper',
      'Colour of Complexes',
      'Stereoisomerism in Transition Element Complexes',
      'Stability Constants, Kstab',
      'Formulas, Functional Groups & the Naming of Organic Compounds (A Level section)',
      'Characteristic Organic Reactions (A Level section)',
      'Shapes of Aromatic Organic Molecules; σ & π Bonds',
      'Isomerism: Optical',
      'Arenes',
      'Halogen Compounds',
      'Alcohols (A Level section)',
      'Phenol',
      'Carboxylic Acids (A Level section)',
      'Esters (A Level section)',
      'Acyl Chlorides',
      'Primary & Secondary Amines',
      'Phenylamine & Azo Compounds',
      'Amides',
      'Amino Acids',
      'Condensation Polymerisation',
      'Predicting the Type of Polymerisation',
      'Degradable Polymers',
      'Gas/Liquid Chromatography',
      'Carbon–13 NMR Spectroscopy',
      'Proton (1H) NMR Spectroscopy'
    ]
  },
  {
    code: 'Biology 9700',
    topics: [
      'The Microscope in Cell Studies',
      'Cells as the Basic Units of Living Organisms',
      'Testing for Biological Molecules',
      'Carbohydrates & Lipids',
      'Proteins',
      'Water',
      'Mode of Action of Enzymes',
      'Factors that Affect Enzyme Action',
      'Fluid Mosaic Membranes',
      'Movement into & out of Cells',
      'Replication & Division of Nuclei & Cells',
      'Chromosome Behaviour in Mitosis',
      'Structure of Nucleic Acids & Replication of DNA',
      'Protein Synthesis',
      'Structure of Transport Tissues',
      'Transport Mechanisms',
      'The Circulatory System',
      'Transport of Oxygen & Carbon Dioxide',
      'The Heart',
      'The Gas Exchange System',
      'Infectious Diseases',
      'Antibiotics',
      'The Immune System',
      'Antibodies & Vaccination',
      'Energy',
      'Respiration',
      'Photosynthesis as an Energy Transfer Process',
      'Investigation of Limiting Factors',
      'Homeostasis in Mammals',
      'Homeostasis in Plants',
      'Control & Coordination in Mammals',
      'Control & Coordination in Plants',
      'Passage of Information from Parents to Offspring',
      'The Roles of Genes in Determining the Phenotype',
      'Gene Control',
      'Variation',
      'Natural & Artificial Selection',
      'Evolution',
      'Classification',
      'Biodiversity',
      'Conservation',
      'Principles of Genetic Technology',
      'Genetic Technology Applied to Medicine',
      'Genetically Modified Organisms in Agriculture'
    ]
  },
  {
    code: 'Economics 9708',
    topics: [
      'Scarcity, Choice & Opportunity Cost',
      'Economic Methodology',
      'Factors of Production',
      'Resource Allocation in Different Economic Systems',
      'Production Possibility Curves',
      'Classification of Goods & Services',
      'Demand & Supply Curves',
      'Market Equilibrium',
      'Elasticities of Demand',
      'Price Elasticity of Supply',
      'Consumer & Producer Surplus',
      'Utility (A Level)',
      'Indifference Curves & Budget Lines (A Level)',
      'Efficiency & Market Failure (A Level)',
      'Externalities & Social Costs & Benefits (A Level)',
      'Costs, Revenue & Production (A Level)',
      'Market Structures',
      'Growth & Survival of Firms',
      'Differing Objectives & Policies of Firms',
      'Reasons for Government Intervention in Markets',
      'Methods & Effects of Government Intervention in Markets'
    ]
  },
  {
    code: 'Business 9609',
    topics: [
      'Enterprise',
      'Business Structure',
      'Size of Business',
      'Business Objectives',
      'Stakeholders in a Business',
      'External Influences on Business (A Level)',
      'Business Strategy (A Level)',
      'Human Resource Management (HRM)',
      'Motivation',
      'Management',
      'Organisational Structure (A Level)',
      'Business Communication (A Level)',
      'Leadership (A Level)',
      'Human Resource Strategy (A Level)',
      'The Nature of Marketing',
      'Market Research',
      'The Marketing Mix',
      'Marketing Analysis (A Level)',
      'Marketing Strategy (A Level)',
      'The Nature of Operations',
      'Inventory Management',
      'Capacity Utilisation & Outsourcing',
      'Location & Scale (A Level)',
      'Quality Management (A Level)',
      'Operations Strategy (A Level)',
      'Business Finance',
      'Sources of Finance',
      'Forecasting & Managing Cash Flows',
      'Budgets',
      'Financial Statements (A Level)',
      'Analysing Published Accounts (A Level)',
      'Investment Appraisal (A Level)',
      'The Exam Papers',
      'Tackling Exam Questions'
    ]
  },
  {
    code: 'Accounting 9706',
    topics: [
      'Types of Business Entity',
      'The Accounting System',
      'Capital & Revenue Income and Expenditure',
      'Accounting for Non-current Assets',
      'Accounting for Accruals, Prepayments & Irrecoverable Debts',
      'Reconciliation & Verification',
      'Adjustments to Draft Financial Statements',
      'Preparation of Financial Statements for Sole Traders',
      'Preparation of Financial Statements for Partnerships',
      'Preparation of Financial Statements for Limited Companies',
      'Material & Labour Costs',
      'Absorption Costing',
      'Marginal Costing',
      'Preparation of Financial Statements for Partnerships',
      'Preparation of Financial Statements for Clubs & Societies',
      'Preparation of Financial Statements for Manufacturing Businesses',
      'Activity Based Costing (ABC)'
    ]
  },
  {
    code: 'Edexcel IGCSE Maths A: Higher',
    topics: [
      'Completing the Square'
    ]
  },
  {
    code: 'Biology 4BI1',
    topics: [
      'Characteristics of Living Organisms',
      'Levels of Organisation',
      'Cell Structure',
      'Biological Molecules',
      'Movement of Substances Into & Out of Cells',
      'Nutrition',
      'Respiration',
      'Gas Exchange',
      'Transport Systems',
      'Excretion',
      'Co-ordination & Response',
      'Reproduction',
      'Inheritance',
      'The Organism in the Environment',
      'Feeding Relationships',
      'Cycles within Ecosystems',
      'Human Influences on the Environment',
      'Food Production',
      'Selective Breeding',
      'Genetic Modification (Genetic Engineering)',
      'Cloning'
    ]
  },
  {
    code: 'Chemistry 4CH1',
    topics: [
      'States of Matter',
      'Elements, Compounds & Mixtures',
      'Atomic Structure',
      'The Periodic Table',
      'Chemical Formulae, Equations, Calculations',
      'Ionic Bonding',
      'Covalent Bonding',
      'Metallic Bonding',
      'Electrolysis',
      'Group 1 (Alkali Metals)',
      'Group 7 (Halogens)',
      'Gases in the Atmosphere',
      'Reactivity Series',
      'Extraction & Uses of Metals',
      'Acids, Alkalis & Titrations',
      'Acids, Bases & Salt Preparations',
      'Chemical Tests',
      'Energetics',
      'Rates of Reaction',
      'Reversible Reactions & Equilibria',
      'Introduction',
      'Crude Oil',
      'Alkanes',
      'Alkenes',
      'Alcohols',
      'Carboxylic acids',
      'Synthetic polymers'
    ]
  },
  {
    code: 'Physics 4PH1',
    topics: [
      'Movement & Position',
      'Forces, Movement & Changing Shape',
      'Momentum',
      'Moments',
      'Current, Potential Difference & Resistance',
      'Components in Series & Parallel Circuits',
      'Electrical Power & Mains Electricity',
      'Static Electricity',
      'Waves & The Electromagnetic Spectrum',
      'Reflection & Refraction',
      'Sound',
      'Energy Stores & Transfers',
      'Work, Power & Energy Resources',
      'Density & Pressure',
      'Changes of State',
      'Ideal Gases',
      'Magnetism & Electromagnetism',
      'Electromagnetic Induction',
      'Properties of Radiation',
      'Fission & Fusion',
      'Motion in the Universe',
      'Cosmology'
    ]
  },
  {
    code: 'Business 4BS1',
    topics: [
      'Business Objectives',
      'Types of Organisations',
      'Classification of Businesses',
      'Decisions on Location',
      'Business & the International Economy',
      'Government Objectives & Policies',
      'External Factors',
      'What Makes a Business Successful?',
      'Internal & External Communication',
      'Recruitment & Selection Process',
      'Training',
      'Motivation & Rewards',
      'Organisation Structure & Employees',
      'Sources of Finance',
      'Cash flow Forecasting',
      'Costs & Break Even Analysis',
      'Financial Documents',
      'Analysis of Accounts',
      'Market Research',
      'The Market',
      'The Marketing Mix',
      'Production',
      'Factors of Production',
      'Quality',
      '6.2 Business Exam Skills',
      '6.3 Structuring Your Responses'
    ]
  },
  {
    code: 'Edexcel A Level Maths 9MA0',
    topics: [
      'Proof',
      'Proof by Contradiction',
      'Laws of Indices & Surds',
      'Quadratics',
      'Simultaneous Equations',
      'Inequalities',
      'Polynomials',
      'Rational Expressions',
      'Graphs of Functions',
      'Functions',
      'Transformations of Functions',
      'Combinations of Transformations',
      'Partial Fractions',
      'Modelling with Functions',
      'Further Modelling with Functions',
      'Equation of a Straight Line',
      'Circles',
      'Binomial Expansion',
      'General Binomial Expansion',
      'Arithmetic Sequences & Series',
      'Geometric Sequences & Series',
      'General Sequences & Series',
      'Modelling with Sequences & Series',
      'Basic Trigonometry',
      'Trigonometric Functions',
      'Trigonometric Equations',
      'Radian Measure',
      'Reciprocal & Inverse Trigonometric Functions',
      'Compound & Double Angle Formulae',
      'Further Trigonometric Equations',
      'Trigonometric Proof',
      'Modelling with Trigonometric Functions',
      'Exponentials & Logarithms',
      'Laws of Logarithms',
      'Modelling with Exponentials & Logarithms',
      'Differentiation',
      'Applications of Differentiation',
      'Further Differentiation',
      'Further Applications of Differentiation',
      'Implicit Differentiation',
      'Integration',
      'Further Integration',
      'Differential Equations',
      'Parametric Equations',
      'Calculus & Modelling with Parametric Equations',
      'Numerical Methods',
      'Modelling involving Numerical Methods',
      'Vectors in 3D',
      'Sampling & Data Collection',
      'Statistical Measures',
      'Data Presentation',
      'Working with Data',
      'Correlation & Regression',
      'Further Correlation & Regression',
      'Basic Probability',
      'Further Probability',
      'Probability Distributions',
      'Binomial Distribution',
      'Normal Distribution',
      'Working with Distributions',
      'Introduction to Hypothesis Testing',
      'Hypothesis Testing (Binomial Distribution)',
      'Hypothesis Testing (Normal Distribution)',
      'Large Data Set',
      'Quantities, Units & Modelling',
      'Scalars & Vectors',
      'Fundamental Units',
      'Derived Units',
      'Types of Force',
      'Modelling Assumptions',
      'Working with Vectors',
      'Graphs in Kinematics',
      'Variable Acceleration in 1D',
      'Constant Acceleration in 1D',
      'Variable Acceleration in 2D',
      'Constant Acceleration in 2D',
      'Projectiles',
      'Newton\'s Second Law (F=ma)',
      'Resolving Forces, Inclined Planes & Friction'
    ]
  },
  {
    code: 'Edexcel A Level Further Maths 9FM0',
    topics: [
      'Complex Numbers & Argand Diagrams',
      'Exponential Form & de Moivre\'s Theorem',
      'Properties of Matrices',
      'Transformations using Matrices',
      'Roots of Polynomials',
      'Series',
      'Maclaurin Series',
      'Hyperbolic Functions',
      'Volumes of Revolution',
      'Methods in Calculus',
      'Vector Lines',
      'Vector Planes',
      'Polar Coordinates',
      'First Order Differential Equations',
      'Second Order Differential Equations',
      'Proof by Induction',
      'The t-formulae',
      'Taylor Series',
      'Reducing Differential Equations',
      'Properties of Ellipses, Parabolas & Hyperbolas',
      'Tangent & Normals to Ellipses, Parabolas & Hyperbolas',
      'Loci Problems',
      'Inequalities',
      'Discrete Probability Distributions',
      'E(X) & Var(X) of Discrete Random Variables',
      'Linear Transformations of DRVs',
      'Problem Solving with DRVs',
      'Geometric & Negative Binomial Distributions',
      'Probability Generating Functions',
      'Central Limit Theorem',
      'Poisson & Geometric Hypothesis Testing',
      'Chi Squared Tests',
      'Quality of Tests'
    ]
  },
  {
    code: 'Physics 9PH0',
    topics: [
      'Transverse & Longitudinal Waves',
      'Interference & Stationary Waves',
      'Refraction, Reflection & Polarisation',
      'Waves, Electrons & Photons',
      'The Photoelectric Effect & Atomic Spectra',
      'Momentum & Impulse',
      'Circular Motion',
      'Electric Fields',
      'Capacitance',
      'Magnetic Fields',
      'Electromagnetic Induction & Alternating Currents',
      'Exploring the Structure of Matter',
      'Particle Interactions & Conservation',
      'Thermal Energy Transfer',
      'Kinetic Theory & Ideal Gases',
      'Black Body Radiation',
      'Astronomy',
      'Cosmology',
      'Nuclear Fusion & Fission',
      'Radioactivity Decay',
      'Gravitational Fields',
      'Simple Harmonic Motion',
      'Resonance'
    ]
  },
  {
    code: 'Chemistry 9CH0',
    topics: [
      'Atomic Structure',
      'Ions & Electrons',
      'The Periodic Table',
      'Bonding',
      'Structure',
      'Formulae, Equations & Avogadro',
      'Reaction Calculations',
      'Energetics I',
      'Kinetics I',
      'Equilibrium I',
      'Redox I',
      'Groups 1 & 2',
      'Group 7',
      'Introduction to Organic Chemistry',
      'Alkanes',
      'Alkenes',
      'Halogenoalkanes',
      'Alcohols',
      'Modern Analytical Techniques I',
      'Physical Chemistry Core Practicals',
      'Inorganic & Organic Chemistry Core Practicals',
      'Equilibrium II',
      'Acid-base Equilibria',
      'Energetics II: Born-Haber',
      'Energetics II: Entropy',
      'Kinetics II',
      'Redox II',
      'Principles of Transition Metal Chemistry',
      'Reactions of Transition Metal Elements',
      'Organic Chemistry II: Chirality',
      'Organic Chemistry II: Carbonyl Chemistry',
      'Organic Chemistry II: Carboxylic Acids',
      'Organic Chemistry III: Aromatic Chemistry',
      'Organic Chemistry III: Nitrogen Chemistry',
      'Organic Chemistry III: Organic Synthesis',
      'Modern Analytical Techniques II',
      'Advanced Physical Chemistry Core Practicals',
      'Advanced Inorganic & Organic Chemistry Core Practicals'
    ]
  },
  {
    code: 'Biology 9BI0',
    topics: [
      'Biological Molecules',
      'The Circulatory System',
      'Diet & Health',
      'Gas Exchange, Cell Membranes & Transport',
      'Proteins',
      'DNA & Gene Expression',
      'Inheritance',
      'Cell Structure & Organisation',
      'Reproduction & Inheritance',
      'Plant Structure & Function',
      'Plants & Conservation',
      'Plants & Bacterial Growth',
      'Classification & Biodiversity',
      'Photosynthesis',
      'Ecosystems',
      'Environmental Biology',
      'Microbiology',
      'Immunity',
      'Antibiotics',
      'Decomposition & Decay',
      'Forensics',
      'Respiration',
      'Muscular Movement',
      'The Nervous System',
      'Plant Hormones',
      'Gene Technology'
    ]
  },
  {
    code: 'Business 9BS0',
    topics: [
      'Meeting Customer Needs',
      'Market',
      'Marketing Mix & Strategy',
      'Managing People',
      'Entrepreneurs & Leaders',
      'Raising Finance',
      'Financial Planning',
      'Managing Finance',
      'Resource Management',
      'External Influences',
      'Business Objectives & Strategy',
      'Business Growth',
      'Decision-Making Techniques',
      'Influences on Business Decisions',
      'Assessing Competitiveness',
      'Managing Change',
      'Globalisation',
      'Global Markets & Business Expansion',
      'Global Marketing',
      'Global Industries & Multinational Corporations',
      'The Exam Papers',
      'Structuring Your Responses',
      '2026 Pre-Release: Confectionery Industry'
    ]
  }
];

interface FoundPdfItem {
  topic: string;
  url: string;
  downloadUrl: string;
  filename: string;
  year?: string;
}

interface AnimatedDropdownProps {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}

function AnimatedDropdown({ label, value, options, onChange }: AnimatedDropdownProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="flex flex-col space-y-2 relative" ref={containerRef}>
      <label className="font-semibold text-[15px] text-purple-200">{label}</label>
      <div className="relative">
        <motion.button
          type="button"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          whileHover={{
            scale: 1.015,
            y: -2,
            boxShadow: '0 10px 25px -5px rgba(56, 189, 248, 0.35)',
          }}
          whileTap={{ scale: 0.99 }}
          transition={{ type: 'spring', stiffness: 380, damping: 22 }}
          onClick={() => setIsOpen((prev) => !prev)}
          className={`w-full text-left bg-white/5 border rounded-xl px-4 py-3.5 focus:outline-none transition-colors cursor-pointer text-white flex items-center justify-between relative overflow-hidden group ${
            isOpen
              ? 'border-cyan-400/70 bg-white/15 ring-2 ring-cyan-400/30'
              : 'border-white/15 hover:border-cyan-400/50 hover:bg-white/10'
          }`}
        >
          {/* Animated hover shimmer sweep */}
          <motion.div
            initial={false}
            animate={{
              x: isHovered || isOpen ? '100%' : '-100%',
              opacity: isHovered || isOpen ? 1 : 0,
            }}
            transition={{ duration: 0.65, ease: 'easeInOut' }}
            className="pointer-events-none absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400/15 to-transparent"
          />

          <span
            className={`relative z-10 truncate pr-3 font-medium ${
              value === '--Select--' ? 'text-gray-300' : 'text-white'
            }`}
          >
            {value}
          </span>

          <motion.div
            animate={{
              rotate: isOpen ? 180 : 0,
              y: isHovered && !isOpen ? [0, 2, 0] : 0,
              scale: isHovered || isOpen ? 1.15 : 1,
            }}
            transition={{
              rotate: { type: 'spring', stiffness: 300, damping: 20 },
              y: { duration: 0.5, repeat: isHovered && !isOpen ? Infinity : 0 },
            }}
            className="relative z-10 flex items-center text-cyan-300 group-hover:text-cyan-200"
          >
            <ChevronDown size={18} />
          </motion.div>
        </motion.button>

        <AnimatePresence>
          {isOpen && (
            <motion.ul
              initial={{ opacity: 0, y: -10, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.96 }}
              transition={{ type: 'spring', stiffness: 420, damping: 28 }}
              className="absolute left-0 right-0 mt-2 bg-slate-950/95 backdrop-blur-2xl border border-cyan-400/30 rounded-xl shadow-[0_16px_40px_rgba(0,0,0,0.75)] max-h-64 overflow-y-auto custom-scrollbar z-50 p-1.5 space-y-1"
            >
              {options.map((option) => {
                const isSelected = option === value;
                return (
                  <motion.li
                    key={option}
                    whileHover={{
                      x: 6,
                      backgroundColor: 'rgba(56, 189, 248, 0.16)',
                    }}
                    whileTap={{ scale: 0.98 }}
                    transition={{ type: 'spring', stiffness: 400, damping: 25 }}
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`px-3.5 py-2.5 rounded-lg text-[14px] cursor-pointer flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-gradient-to-r from-cyan-500/25 to-blue-500/25 text-cyan-200 font-semibold border border-cyan-400/30'
                        : 'text-gray-200 hover:text-white'
                    }`}
                  >
                    <span className="truncate pr-2">{option}</span>
                    {isSelected && <Check className="w-4 h-4 text-cyan-300 flex-shrink-0" />}
                  </motion.li>
                );
              })}
            </motion.ul>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function inferBoardAndLevel(subjectCode: string): { board?: string; level?: string } {
  if (!subjectCode || subjectCode === '--Select--') return {};
  if (/\b(?:0610|0620|0580|0510|0625|0417|0478|0450|0455|0452)\b/.test(subjectCode)) {
    return { board: 'Cambridge', level: 'IGCSE' };
  }
  if (/\b(?:9709|9702|9701|9700|9708|9609|9706)\b/.test(subjectCode)) {
    return { board: 'Cambridge', level: 'A-Level' };
  }
  if (/\b(?:4BI1|4CH1|4PH1|4BS1)\b/.test(subjectCode) || subjectCode.includes('Edexcel IGCSE')) {
    return { board: 'Edexcel', level: 'IGCSE' };
  }
  if (/\b(?:9MA0|9FM0|9PH0|9CH0|9BI0|9BS0)\b/.test(subjectCode) || subjectCode.includes('Edexcel A Level')) {
    return { board: 'Edexcel', level: 'A-Level' };
  }
  return {};
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const blobUrl = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = blobUrl;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  setTimeout(() => {
    if (document.body.contains(a)) {
      document.body.removeChild(a);
    }
    window.URL.revokeObjectURL(blobUrl);
  }, 15000);
}

export default function App() {
  const [subTopic, setSubTopic] = useState('');
  const [examBoard, setExamBoard] = useState('--Select--');
  const [level, setLevel] = useState('--Select--');
  const [contentType, setContentType] = useState('Revision Notes');
  const [autoOpen, setAutoOpen] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const [browseMode, setBrowseMode] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState('--Select--');
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);
  const [blockedLinks, setBlockedLinks] = useState<{ topic: string; url: string }[]>([]);
  const [foundPdfs, setFoundPdfs] = useState<FoundPdfItem[]>([]);
  const [previewPdfUrl, setPreviewPdfUrl] = useState<string | null>(null);
  const [zipDownloadInfo, setZipDownloadInfo] = useState<{ url: string; filename: string } | null>(null);
  const [downloadStatus, setDownloadStatus] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const CONTENT_TYPES = [
    'Revision Notes',
    'Multiple Choice Questions',
    'Theory Questions',
    'Alternative to Practical Questions',
    'Mark Schemes'
  ];

  const getEffectiveSubject = () => {
    return selectedSubject !== '--Select--' ? selectedSubject : '';
  };

  const buildDownloadEndpoint = (topic: string, directUrl?: string) => {
    const params = new URLSearchParams({
      board: examBoard,
      level,
      subject: getEffectiveSubject(),
      topic,
      contentType,
    });
    if (directUrl) {
      params.set('url', directUrl);
    }
    return `/api/download?${params.toString()}`;
  };

  const buildRedirectEndpoint = (topic: string) => {
    const params = new URLSearchParams({
      board: examBoard,
      level,
      subject: getEffectiveSubject(),
      topic,
      contentType,
    });
    return `/api/redirect?${params.toString()}`;
  };

  const validateInputs = (): string[] | null => {
    setErrorMessage('');
    if (examBoard === '--Select--') {
      setErrorMessage('Please choose an Exam Board before searching or downloading.');
      return null;
    }
    if (level === '--Select--') {
      setErrorMessage('Please select a Level (e.g., IGCSE, GCSE, A-Level).');
      return null;
    }

    if (browseMode) {
      if (selectedSubject === '--Select--') {
        setErrorMessage('Please select a Subject from the list.');
        return null;
      }
      if (selectedTopics.length === 0) {
        setErrorMessage('Please select at least one topic.');
        return null;
      }
      return selectedTopics;
    } else {
      if (!subTopic.trim()) {
        setErrorMessage('Please enter a Sub Topic (e.g., Cell Structure, Electrolysis).');
        return null;
      }
      return [subTopic.trim()];
    }
  };

  // Direct single-topic or multi-topic download handler
  const handleDownloadAction = async (topicsOverride?: string[]) => {
    const topicsToSearch = topicsOverride || validateInputs();
    if (!topicsToSearch) return;

    // If Auto-Open is enabled and there is only 1 topic, open /api/redirect synchronously on user gesture
    if (autoOpen && topicsToSearch.length === 1) {
      const redirectUrl = buildRedirectEndpoint(topicsToSearch[0]);
      const a = document.createElement('a');
      a.href = redirectUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    setIsLoading(true);
    setBlockedLinks([]);
    setFoundPdfs([]);
    setPreviewPdfUrl(null);
    if (zipDownloadInfo) {
      window.URL.revokeObjectURL(zipDownloadInfo.url);
      setZipDownloadInfo(null);
    }
    setDownloadStatus('Finding & downloading PDF(s)...');

    const failed: { topic: string; url: string }[] = [];
    const discovered: FoundPdfItem[] = [];
    const zip = new JSZip();
    let downloadedCount = 0;

    const batchSize = 4;
    for (let i = 0; i < topicsToSearch.length; i += batchSize) {
      const batch = topicsToSearch.slice(i, i + batchSize);
      setDownloadStatus(
        topicsToSearch.length === 1
          ? `Fetching "${batch[0]}" PDF...`
          : `Fetching topics ${i + 1} to ${Math.min(i + batchSize, topicsToSearch.length)} of ${topicsToSearch.length}...`
      );

      const results = await Promise.all(
        batch.map(async (topic) => {
          try {
            const subjectParam = getEffectiveSubject();
            const searchRes = await fetch(
              `/api/search?board=${encodeURIComponent(examBoard)}&level=${encodeURIComponent(level)}&subject=${encodeURIComponent(subjectParam)}&topic=${encodeURIComponent(topic)}&contentType=${encodeURIComponent(contentType)}`
            );

            let cdnUrl = '';
            if (searchRes.ok) {
              const searchData = await searchRes.json();
              cdnUrl = searchData.url || '';
            }

            const downloadUrl = buildDownloadEndpoint(topic, cdnUrl || undefined);
            const res = await fetch(downloadUrl);
            if (res.ok) {
              const rawBlob = await res.blob();
              const pdfBlob = new Blob([rawBlob], { type: 'application/pdf' });
              const safeFilename = `${topic.replace(/[^a-zA-Z0-9 -]/g, '').trim() || 'Document'}.pdf`;
              return {
                topic,
                blob: pdfBlob,
                cdnUrl: cdnUrl || downloadUrl,
                downloadUrl,
                filename: safeFilename,
                success: true,
              };
            }
            return { topic, success: false };
          } catch {
            return { topic, success: false };
          }
        })
      );

      for (const result of results) {
        if (result.success && result.blob && result.cdnUrl && result.downloadUrl && result.filename) {
          discovered.push({
            topic: result.topic,
            url: result.cdnUrl,
            downloadUrl: result.downloadUrl,
            filename: result.filename,
          });

          if (topicsToSearch.length === 1) {
            triggerBlobDownload(result.blob, result.filename);
            if (autoOpen) {
              setPreviewPdfUrl(result.cdnUrl);
            }
          } else {
            zip.file(result.filename, result.blob);
            downloadedCount++;
          }
        } else {
          failed.push({
            topic: result.topic,
            url: `https://www.google.com/search?q=${encodeURIComponent(`site:cdn.savemyexams.com ${examBoard} ${level} ${getEffectiveSubject()} ${result.topic} "${contentType}" filetype:pdf`)}`,
          });
        }
      }
    }

    if (topicsToSearch.length > 1 && downloadedCount > 0) {
      setDownloadStatus(`Zipping ${downloadedCount} PDF files...`);
      const zipBlob = await zip.generateAsync({ type: 'blob' });
      const zipFilename = `${examBoard}_${level.replace(/[^a-zA-Z0-9]/g, '')}_${contentType.replace(/\s+/g, '_')}.zip`;
      const zipUrl = window.URL.createObjectURL(zipBlob);
      setZipDownloadInfo({ url: zipUrl, filename: zipFilename });
      triggerBlobDownload(zipBlob, zipFilename);
    }

    setFoundPdfs(discovered);
    setBlockedLinks(failed);
    setDownloadStatus('');
    setIsLoading(false);
  };

  // Search / Auto-Open handler
  const handleSearch = async () => {
    const topicsToSearch = validateInputs();
    if (!topicsToSearch) return;

    if (browseMode) {
      await handleDownloadAction(topicsToSearch);
      return;
    }

    const topic = topicsToSearch[0];
    const subjectParam = getEffectiveSubject();

    if (!autoOpen) {
      const query = `site:cdn.savemyexams.com ${examBoard} ${level} ${subjectParam} ${topic} "${contentType}" filetype:pdf`
        .replace(/\s+/g, ' ')
        .trim();
      const googleUrl = `https://www.google.com/search?q=${encodeURIComponent(query)}`;
      const a = document.createElement('a');
      a.href = googleUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Synchronously open /api/redirect in a new tab during the click gesture so popup blockers don't block it
      const redirectUrl = buildRedirectEndpoint(topic);
      const a = document.createElement('a');
      a.href = redirectUrl;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }

    // Simultaneously resolve the exact PDF URL in-app so the user also gets direct Open, Download, and Inline Preview
    setIsLoading(true);
    setBlockedLinks([]);
    setFoundPdfs([]);
    setPreviewPdfUrl(null);
    setDownloadStatus(`Locating "${topic}" PDF...`);

    try {
      const res = await fetch(
        `/api/search?board=${encodeURIComponent(examBoard)}&level=${encodeURIComponent(level)}&subject=${encodeURIComponent(subjectParam)}&topic=${encodeURIComponent(topic)}&contentType=${encodeURIComponent(contentType)}`
      );
      if (res.ok) {
        const data = await res.json();
        if (data.url) {
          const safeFilename = `${topic.replace(/[^a-zA-Z0-9 -]/g, '').trim() || 'Document'}.pdf`;
          const item: FoundPdfItem = {
            topic,
            url: data.url,
            downloadUrl: buildDownloadEndpoint(topic, data.url),
            filename: safeFilename,
          };
          setFoundPdfs([item]);
          if (autoOpen) {
            setPreviewPdfUrl(data.url);
          }
        }
      } else {
        setBlockedLinks([
          {
            topic,
            url: `https://www.google.com/search?q=${encodeURIComponent(`site:cdn.savemyexams.com ${examBoard} ${level} ${subjectParam} ${topic} "${contentType}" filetype:pdf`)}`,
          },
        ]);
      }
    } catch {
      setBlockedLinks([
        {
          topic,
          url: `https://www.google.com/search?q=${encodeURIComponent(`site:cdn.savemyexams.com ${examBoard} ${level} ${subjectParam} ${topic} "${contentType}" filetype:pdf`)}`,
        },
      ]);
    } finally {
      setDownloadStatus('');
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans flex items-center justify-center p-4 md:p-8 relative overflow-hidden">
      {/* Animated colorful background blobs */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-gradient-to-r from-blue-600 to-indigo-600 blur-[100px] opacity-60 animate-blob" />
      <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-gradient-to-r from-cyan-600 to-blue-600 blur-[120px] opacity-50 animate-blob animation-delay-2000" />
      <div className="absolute bottom-[-20%] left-[20%] w-[60%] h-[60%] rounded-full bg-gradient-to-r from-teal-500 to-cyan-500 blur-[130px] opacity-40 animate-blob animation-delay-4000" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="bg-white/10 backdrop-blur-2xl w-full max-w-2xl rounded-[2rem] shadow-[0_8px_32px_0_rgba(31,38,135,0.37)] p-8 md:p-10 border border-white/20 relative z-10"
      >
        <div className="flex justify-center mb-6">
          <motion.div 
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            whileHover={{ scale: 1.08, rotate: 3 }}
            transition={{ type: "spring", stiffness: 260, damping: 18, delay: 0.15 }}
            className="bg-black p-2.5 rounded-2xl shadow-[0_0_28px_rgba(56,189,248,0.55)] border border-cyan-400/40 flex items-center justify-center overflow-hidden"
          >
            <img
              src="/assets/aistudio/image_a5179389.png"
              alt="SaveMyExams Searcher Logo"
              className="w-16 h-16 object-contain rounded-xl"
            />
          </motion.div>
        </div>

        <h1 className="text-3xl md:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 text-center mb-2 tracking-tight">
          SaveMyExams Searcher
        </h1>
        <p className="text-center text-xs md:text-sm text-cyan-200/80 font-medium mb-8 flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-cyan-300" />
          <span>Always Prioritizing Latest 2026 Syllabus Edition PDFs</span>
        </p>

        <div className="space-y-6">
          {/* Validation Error Banner */}
          <AnimatePresence>
            {errorMessage && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className="bg-red-500/15 border border-red-400/30 rounded-xl p-4 flex items-center gap-3 text-red-200 text-[14px]"
              >
                <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                <span>{errorMessage}</span>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Browse Mode Toggle */}
          <motion.div 
            whileHover={{ scale: 1.01 }}
            className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-5 mt-4 transition-colors hover:bg-white/10"
          >
            <div className="flex flex-col pr-6">
              <span className="font-bold text-[15px] flex items-center gap-2">
                <Layers className="w-4 h-4 text-purple-300" /> Browse by Subject & Topic
              </span>
              <span className="text-[13px] text-gray-300 italic mt-1 leading-snug">
                Select from a predefined list of subjects and topics instead of typing manually.
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setBrowseMode(!browseMode);
                setErrorMessage('');
                if (!browseMode) {
                  setSelectedTopics([]);
                }
              }}
              className={`relative inline-flex h-[32px] w-[56px] flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none shadow-inner ${
                browseMode ? 'bg-blue-500' : 'bg-white/20'
              }`}
              role="switch"
              aria-checked={browseMode}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                  browseMode ? 'translate-x-[24px]' : 'translate-x-0'
                }`}
              />
            </button>
          </motion.div>

          <AnimatePresence mode="wait">
            {browseMode ? (
              <motion.div 
                key="browse"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6 overflow-visible"
              >
                <AnimatedDropdown
                  label="Choose Subject:"
                  value={selectedSubject}
                  options={['--Select--', ...SUBJECTS.map((s) => s.code)]}
                  onChange={(val) => {
                    setSelectedSubject(val);
                    setSelectedTopics([]);
                    setErrorMessage('');
                    const inferred = inferBoardAndLevel(val);
                    if (inferred.board) setExamBoard(inferred.board);
                    if (inferred.level) setLevel(inferred.level);
                  }}
                />

                {selectedSubject !== '--Select--' && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <label className="font-semibold text-[15px] text-purple-200">
                        Select Topics ({selectedTopics.length} selected):
                      </label>
                      <button 
                        type="button"
                        onClick={() => {
                          const subject = SUBJECTS.find(s => s.code === selectedSubject);
                          if (subject) {
                            if (selectedTopics.length === subject.topics.length) {
                              setSelectedTopics([]);
                            } else {
                              setSelectedTopics(subject.topics);
                            }
                          }
                        }}
                        className="text-[13px] font-medium text-purple-300 hover:text-purple-100 transition-colors bg-white/5 hover:bg-white/10 px-3 py-1 rounded-full cursor-pointer"
                      >
                        {selectedTopics.length === SUBJECTS.find(s => s.code === selectedSubject)?.topics.length ? 'Deselect All' : 'Select All'}
                      </button>
                    </div>
                    <div className="bg-white/5 border border-white/10 rounded-xl p-4 max-h-64 overflow-y-auto space-y-2 custom-scrollbar">
                      {SUBJECTS.find(s => s.code === selectedSubject)?.topics.map((topic, index) => (
                        <motion.label 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.01 }}
                          key={`${topic}-${index}`} 
                          className="flex items-start space-x-3 cursor-pointer group p-2 rounded-lg hover:bg-white/5 transition-colors"
                        >
                          <div className="flex items-center h-5 mt-0.5">
                            <input
                              type="checkbox"
                              checked={selectedTopics.includes(topic)}
                              onChange={(e) => {
                                setErrorMessage('');
                                if (e.target.checked) {
                                  setSelectedTopics([...selectedTopics, topic]);
                                } else {
                                  setSelectedTopics(selectedTopics.filter(t => t !== topic));
                                }
                              }}
                              className="w-4 h-4 rounded border-white/30 text-blue-500 focus:ring-blue-500 focus:ring-offset-slate-900 bg-white/10 cursor-pointer"
                            />
                          </div>
                          <span className="text-[14px] text-gray-200 group-hover:text-white transition-colors leading-snug">
                            {topic}
                          </span>
                        </motion.label>
                      ))}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            ) : (
              <motion.div 
                key="manual"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="flex flex-col space-y-2 overflow-hidden"
              >
                <label className="font-semibold text-[15px] text-purple-200">Sub Topic:</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-purple-300">
                    <Search size={18} />
                  </div>
                  <input
                    type="text"
                    value={subTopic}
                    onChange={(e) => {
                      setSubTopic(e.target.value);
                      setErrorMessage('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !isLoading) {
                        handleSearch();
                      }
                    }}
                    placeholder="Enter your topic (e.g., Cell Structure, Electrolysis)"
                    className="w-full bg-white/5 border border-white/10 hover:bg-white/10 rounded-xl pl-11 pr-4 py-3.5 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all placeholder:text-gray-400 text-white"
                  />
                </div>
                <p className="text-[13px] text-gray-300 italic mt-1 leading-snug pl-1">
                  Input the specific SUB TOPIC you want to search or download.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Exam Board */}
            <AnimatedDropdown
              label="Exam Board:"
              value={examBoard}
              options={['--Select--', 'AQA', 'OCR', 'Edexcel', 'Eduqas', 'Cambridge']}
              onChange={(val) => {
                setExamBoard(val);
                setErrorMessage('');
              }}
            />

            {/* Level */}
            <AnimatedDropdown
              label="Level:"
              value={level}
              options={['--Select--', 'GCSE (Separate)', 'GCSE (Combined)', 'A-Level', 'IGCSE']}
              onChange={(val) => {
                setLevel(val);
                setErrorMessage('');
              }}
            />
          </div>

          {/* Content Type */}
          <AnimatedDropdown
            label="Content Type:"
            value={contentType}
            options={CONTENT_TYPES}
            onChange={(val) => setContentType(val)}
          />

          {/* Auto-Open PDF Toggle - Available in both modes */}
          <div className="flex items-center justify-between bg-white/5 border border-white/10 rounded-2xl p-5 mt-2 transition-colors hover:bg-white/10">
            <div className="flex flex-col pr-6">
              <span className="font-bold text-[15px] flex items-center gap-2">
                <FileText className="w-4 h-4 text-cyan-300" /> Auto-Open PDF
              </span>
              <span className="text-[13px] text-gray-300 italic mt-1 leading-snug">
                Automatically resolve and open the direct SaveMyExams CDN PDF in a new tab & live viewer.
              </span>
            </div>
            <button
              type="button"
              onClick={() => setAutoOpen(!autoOpen)}
              className={`relative inline-flex h-[32px] w-[56px] flex-shrink-0 rounded-full border-2 border-transparent transition-colors duration-300 ease-in-out focus:outline-none shadow-inner ${
                autoOpen ? 'bg-cyan-500 cursor-pointer' : 'bg-white/20 cursor-pointer'
              }`}
              role="switch"
              aria-checked={autoOpen}
            >
              <span
                aria-hidden="true"
                className={`pointer-events-none inline-block h-[28px] w-[28px] transform rounded-full bg-white shadow-md ring-0 transition duration-300 ease-in-out ${
                  autoOpen ? 'translate-x-[24px]' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Action Buttons */}
          {browseMode ? (
            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.02, y: -2 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              onClick={() => handleDownloadAction()}
              disabled={isLoading}
              className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all mt-6 text-[16px] flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
              <span className="relative flex items-center gap-2">
                {isLoading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>{downloadStatus || 'Processing...'}</span>
                  </>
                ) : (
                  <>
                    <Download className="w-5 h-5" />
                    <span>
                      {selectedTopics.length > 1
                        ? `Download ${selectedTopics.length} PDFs (.ZIP)`
                        : autoOpen
                        ? 'Download & Auto-Open PDF'
                        : 'Download PDF'}
                    </span>
                  </>
                )}
              </span>
            </motion.button>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02, y: -2 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                onClick={handleSearch}
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 via-indigo-600 to-cyan-600 hover:from-blue-500 hover:via-indigo-500 hover:to-cyan-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl shadow-[0_0_20px_rgba(59,130,246,0.4)] hover:shadow-[0_0_30px_rgba(59,130,246,0.6)] transition-all text-[15px] flex items-center justify-center gap-2 relative overflow-hidden group cursor-pointer"
              >
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-in-out" />
                <span className="relative flex items-center gap-2">
                  {isLoading ? (
                    <>
                      <Loader2 className="w-5 h-5 animate-spin" />
                      <span>{downloadStatus || 'Searching...'}</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-5 h-5" />
                      <span>{autoOpen ? 'Auto-Open PDF' : 'Search PDF'}</span>
                    </>
                  )}
                </span>
              </motion.button>

              <motion.button
                whileHover={{ scale: isLoading ? 1 : 1.02, y: -2 }}
                whileTap={{ scale: isLoading ? 1 : 0.98 }}
                onClick={() => handleDownloadAction()}
                disabled={isLoading}
                className="w-full bg-white/10 hover:bg-white/20 border border-cyan-400/30 disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 px-4 rounded-xl transition-all text-[15px] flex items-center justify-center gap-2 cursor-pointer"
              >
                <Download className="w-5 h-5 text-cyan-300" />
                <span>Download PDF</span>
              </motion.button>
            </div>
          )}

          {/* Multiple Downloads Warning */}
          <AnimatePresence>
            {browseMode && selectedTopics.length > 1 && !isLoading && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 mt-4 text-center backdrop-blur-sm"
              >
                <p className="text-blue-300 font-bold text-[14px] mb-1 flex items-center justify-center gap-2">
                  <CheckCircle2 className="w-4 h-4" /> Downloading as ZIP
                </p>
                <p className="text-[12px] text-blue-100/70">
                  Multiple PDFs are bundled into a single <strong>.zip</strong> archive and individual download links will also appear below.
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Found PDFs / Direct Open & Download Links */}
          <AnimatePresence>
            {foundPdfs.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-5 mt-6 space-y-4 backdrop-blur-sm"
              >
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <h3 className="text-emerald-300 font-bold text-[15px] flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5" />
                    {foundPdfs.length === 1 ? 'PDF Ready!' : `${foundPdfs.length} PDFs Ready!`}
                  </h3>

                  {zipDownloadInfo && (
                    <a
                      href={zipDownloadInfo.url}
                      download={zipDownloadInfo.filename}
                      className="inline-flex items-center gap-1.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-[13px] px-3.5 py-1.5 rounded-lg transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Download All (.ZIP)
                    </a>
                  )}
                </div>

                <div className="space-y-2.5 max-h-60 overflow-y-auto custom-scrollbar pr-1">
                  {foundPdfs.map((item, idx) => (
                    <div
                      key={`${item.topic}-${idx}`}
                      className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white/5 border border-white/10 rounded-xl p-3.5"
                    >
                      <div className="min-w-0 flex-1">
                        <p className="font-semibold text-[14px] text-white truncate">{item.topic}</p>
                        <p className="text-[12px] text-emerald-200/70 truncate">{item.url}</p>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            setPreviewPdfUrl(previewPdfUrl === item.url ? null : item.url)
                          }
                          className="inline-flex items-center gap-1.5 bg-white/10 hover:bg-white/20 text-white text-[13px] font-medium px-3 py-2 rounded-lg transition-colors cursor-pointer"
                        >
                          {previewPdfUrl === item.url ? (
                            <>
                              <EyeOff className="w-4 h-4 text-cyan-300" />
                              Hide
                            </>
                          ) : (
                            <>
                              <Eye className="w-4 h-4 text-cyan-300" />
                              Preview
                            </>
                          )}
                        </button>
                        <a
                          href={item.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-[13px] px-3 py-2 rounded-lg transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                          Open PDF
                        </a>
                        <a
                          href={item.downloadUrl}
                          download={item.filename}
                          className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-[13px] px-3 py-2 rounded-lg transition-colors"
                        >
                          <Download className="w-4 h-4" />
                          Download
                        </a>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Inline Embedded PDF Viewer */}
                {previewPdfUrl && (
                  <div className="mt-4 pt-3 border-t border-white/10 space-y-2">
                    <div className="flex items-center justify-between text-[13px] text-gray-300">
                      <span>Inline PDF Viewer</span>
                      <a
                        href={previewPdfUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-cyan-300 hover:underline flex items-center gap-1"
                      >
                        Open Fullscreen <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>
                    <iframe
                      src={previewPdfUrl}
                      title="SaveMyExams PDF Viewer"
                      className="w-full h-[520px] rounded-xl border border-white/20 bg-white"
                    />
                  </div>
                )}
              </motion.div>
            )}
          </AnimatePresence>

          {/* Blocked Links Fallback */}
          <AnimatePresence>
            {blockedLinks.length > 0 && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-orange-500/10 border border-orange-500/20 rounded-xl p-5 mt-6 backdrop-blur-sm"
              >
                <h3 className="text-orange-300 font-bold text-[15px] mb-2 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" /> Some PDFs Not Found
                </h3>
                <p className="text-[13px] text-orange-100/70 mb-4">
                  We couldn't automatically download some of the topics. You can search for them manually using the links below:
                </p>
                <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar pr-2">
                  {blockedLinks.map((link, i) => (
                    <a
                      key={i}
                      href={link.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 w-full bg-white/5 hover:bg-white/10 border border-white/5 text-white text-left px-4 py-3 rounded-lg transition-colors text-[14px] group"
                    >
                      <Search className="w-4 h-4 text-orange-300 group-hover:text-orange-200" />
                      <span className="truncate">{link.topic}</span>
                    </a>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Footer - Visit MCQZONE.UK */}
          <div className="mt-8 pt-4 border-t border-white/10 flex justify-center">
            <motion.a
              href="https://mcqzone.uk"
              target="_blank"
              rel="noopener noreferrer"
              whileHover={{ scale: 1.06, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="group relative inline-flex items-center gap-2.5 px-6 py-3 rounded-2xl bg-gradient-to-r from-fuchsia-500/20 via-cyan-500/20 to-indigo-500/20 hover:from-fuchsia-500/35 hover:via-cyan-500/35 hover:to-indigo-500/35 border border-cyan-400/40 shadow-[0_0_25px_rgba(56,189,248,0.25)] hover:shadow-[0_0_35px_rgba(217,70,239,0.45)] transition-all duration-300"
            >
              <Sparkles className="w-4 h-4 text-fuchsia-300 group-hover:rotate-12 transition-transform" />
              <span className="text-[15px] font-extrabold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-pink-300 via-cyan-300 to-purple-300">
                Visit MCQZONE.UK
              </span>
              <ExternalLink className="w-4 h-4 text-cyan-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
            </motion.a>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
