// Mock data for SHANGKORONG KHALING's portfolio
export const portfolioData = {
  // Personal Information
  personal: {
    name: "SHANGKORONG KHALING",
    title: "Design Verification Engineer — UVM/SystemVerilog",
    tagline: "Building robust, reusable verification environments for high-performance silicon",
    phone: "+91 88260 23831",
    email: "shangkorongkhaling@gmail.com",
    linkedin: "https://www.linkedin.com/in/lalavluna/",
    location: "India"
  },

  // Skills organized by category
  skills: {
    verification: [
      "UVM", "SystemVerilog", "Verilog", "Constrained-random", 
      "Coverage", "Assertions", "Scoreboards", "BFMs", "Monitors", "Drivers"
    ],
    protocols: [
      "APB", "AHB", "AXI", "Ethernet MAC", "FIFO", "Memory", "FSM"
    ],
    tools: [
      "QuestaSim", "ModelSim", "GVim", "Git", "Linux shell", "Python", "C++"
    ],
    domains: [
      "Digital design", "Bus protocols", "SoC-level concepts", 
      "NoC", "Fault tolerance", "Energy-efficient VLSI", "Neuromorphic"
    ]
  },

  // Projects with impact-first descriptions
  projects: [
    {
      id: "configurable-memory-dv",
      title: "Configurable Memory DV (Front/Back-Door)",
      impact: "Parameterized memory verified with UVM sequences and integrity checks for robust reuse",
      technologies: ["UVM", "SystemVerilog", "Memory Models", "Coverage"],
      category: "Memory Verification",
      status: "Completed",
      description: "Developed comprehensive verification environment for configurable memory with both front-door and back-door access methods.",
      keyFeatures: [
        "Parameterized memory models supporting various configurations",
        "UVM-based testbench with constrained random stimulus",
        "Comprehensive coverage model with cross-coverage",
        "Integrity checks and data corruption detection"
      ]
    },
    {
      id: "sync-async-fifo-dv",
      title: "Sync/Async FIFO DV",
      impact: "Directed and randomized scenarios covering full/empty, overflow/underflow, and wrap conditions to harden reliability",
      technologies: ["UVM", "SystemVerilog", "FIFO", "Assertions"],
      category: "FIFO Verification",
      status: "Completed",
      description: "Built robust verification environment for both synchronous and asynchronous FIFO designs.",
      keyFeatures: [
        "Comprehensive test scenarios for boundary conditions",
        "Clock domain crossing verification for async FIFO",
        "Overflow/underflow detection and handling",
        "Performance and timing analysis"
      ]
    },
    {
      id: "sequence-detector-dv",
      title: "Mealy/Moore Sequence Detector DV",
      impact: "Functional correctness validated with coverage-driven stimulus for predictable behavior",
      technologies: ["SystemVerilog", "FSM", "Coverage", "Assertions"],
      category: "FSM Verification",
      status: "Completed",
      description: "Developed verification framework for sequence detector state machines with comprehensive FSM coverage.",
      keyFeatures: [
        "State transition coverage and validation",
        "Input sequence generation and corner cases",
        "Output verification and timing checks",
        "Reset and recovery behavior validation"
      ]
    },
    {
      id: "protocol-dv-suite",
      title: "APB/AHB/AXI Protocol DV",
      impact: "Handshakes, bursts, and integrity checks to reduce late-stage integration risk",
      technologies: ["UVM", "APB", "AHB", "AXI", "Protocol Compliance"],
      category: "Bus Protocol Verification",
      status: "Completed",
      description: "Comprehensive protocol verification suite covering industry-standard bus protocols.",
      keyFeatures: [
        "Protocol compliance checking and timing validation",
        "Burst transaction verification and error injection",
        "Handshake protocol validation",
        "Multi-master and arbitration scenarios"
      ]
    },
    {
      id: "ethernet-mac-dv",
      title: "Ethernet MAC DV (UVM)",
      impact: "Register configuration, R/W access, reset handling, and end-to-end checks for robust bring-up",
      technologies: ["UVM", "Ethernet", "MAC", "Protocol Verification"],
      category: "Network Protocol",
      status: "Completed",
      description: "Full UVM testbench for Ethernet MAC verification with comprehensive protocol coverage.",
      keyFeatures: [
        "Register model integration and CSR testing",
        "Frame transmission and reception validation",
        "Error handling and recovery mechanisms",
        "Performance benchmarking and stress testing"
      ]
    },
    {
      id: "pipelined-mips32",
      title: "Pipelined MIPS32 (Design + DV)",
      impact: "Pipeline behavior and instruction execution validated across stages",
      technologies: ["SystemVerilog", "MIPS", "Pipeline", "Instruction Set"],
      category: "Processor Verification",
      status: "Completed",
      description: "Complete design and verification of pipelined MIPS32 processor with hazard detection.",
      keyFeatures: [
        "Instruction pipeline verification",
        "Hazard detection and forwarding validation",
        "Branch prediction accuracy testing",
        "Performance analysis and optimization"
      ]
    }
  ],

  // Research projects
  research: [
    {
      id: "accent-classification",
      title: "Accent Classification for Bangla, Malayalam, and Telugu",
      description: "LSTM/CNN1D implementation for accent recognition with collaborator attribution and ASR/NLP focus",
      technologies: ["LSTM", "CNN1D", "ASR", "NLP", "Python"],
      status: "Published",
      collaborators: ["Research Team"]
    },
    {
      id: "quadcopter-pid",
      title: "Quadcopter with PID Control",
      description: "Autonomous flight control system with PID controller implementation",
      technologies: ["PID Control", "Embedded Systems", "C++"],
      status: "Completed"
    },
    {
      id: "churn-ann",
      title: "Customer Churn Prediction using ANN",
      description: "Artificial Neural Network for customer behavior analysis and churn prediction",
      technologies: ["ANN", "Machine Learning", "Python"],
      status: "Completed"
    }
  ],

  // Awards and certifications
  awards: [
    {
      title: "NTSE State 2nd (ST)",
      organization: "National Talent Search Examination",
      year: "2016"
    },
    {
      title: "Distinction in Mathematics",
      organization: "IAIS (International Assessment for Indian Schools)",
      year: "2017"
    },
    {
      title: "Crossword Competition 1st Place",
      organization: "State Level Competition",
      year: "2018"
    },
    {
      title: "Speech Competition 3rd Place",
      organization: "Inter-college Competition",
      year: "2019"
    }
  ],

  // Training and certifications
  training: [
    "AI/ML/DL Fundamentals",
    "Intel OpenVINO Toolkit",
    "AWS Builders Program", 
    "AWS Innovate Program",
    "PCB Design and Layout",
    "STM32 Cube Programming",
    "IoT Systems Development",
    "AutoCAD Design",
    "MATLAB Programming",
    "Data Science and Analytics"
  ],

  // Companies admired (with non-affiliation disclaimer)
  companies: [
    {
      name: "AMD",
      logo: "/images/companies/amd.svg",
      description: "Advanced semiconductor solutions"
    },
    {
      name: "NVIDIA",
      logo: "/images/companies/nvidia.svg", 
      description: "AI and GPU computing leader"
    },
    {
      name: "Intel",
      logo: "/images/companies/intel.svg",
      description: "Semiconductor innovation pioneer"
    },
    {
      name: "Qualcomm",
      logo: "/images/companies/qualcomm.svg",
      description: "Wireless technology advancement"
    },
    {
      name: "ARM",
      logo: "/images/companies/arm.svg",
      description: "Processor architecture excellence"
    },
    {
      name: "Infineon",
      logo: "/images/companies/infineon.svg",
      description: "Power semiconductor solutions"
    }
  ],

  // Navigation structure
  navigation: [
    { name: "About", href: "#hero" },
    { name: "Skills", href: "#skills" },
    { name: "Projects", href: "#projects" },
    { name: "Case Studies", href: "#projects" },
    { name: "Research", href: "#research" },
    { name: "Awards", href: "#awards" },
    { name: "Contact", href: "#contact" }
  ],

  // Hero stats for liquid-glass panel
  heroStats: [
    { label: "Verification Projects", value: "15+" },
    { label: "Protocol Coverage", value: "98%" },
    { label: "Bug Detection Rate", value: "99.2%" },
    { label: "Reusable Components", value: "25+" }
  ]
};

// Export individual sections for easier component consumption
export const {
  personal,
  skills,
  projects,
  research,
  awards,
  training,
  companies,
  navigation,
  heroStats
} = portfolioData;