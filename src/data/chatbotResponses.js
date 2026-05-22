export const chatbotResponses = {
  'meter-bridge': {
    greeting: "Let's work on the Meter Bridge experiment! I'll help you find the specific resistance of the wire.",
    steps: [
      "First, make sure the Meter Bridge is properly connected. The unknown resistance X goes in the left gap and the resistance box S in the right gap.",
      "Connect the battery and key. Also connect the galvanometer between the central terminal and the jockey.",
      "Set a value of S in the resistance box. Start with S = 1Ω.",
      "Now slide the jockey along the bridge wire. Watch the galvanometer!",
      "Find the point where the galvanometer shows ZERO deflection — this is the null point.",
      "Note the balancing length 'l' from the left end.",
      "Calculate R = S × l / (100 - l). This gives the unknown resistance!",
      "Repeat with different S values (2, 3, 4, 5 Ω) for accuracy.",
      "Finally, calculate specific resistance ρ = πr²R / L. Well done! 🎉"
    ],
    errors: {
      noConnection: "⚠️ The circuit is not complete. Make sure the key is pressed and all connections are tight.",
      wrongNull: "The galvanometer is showing deflection. Move the jockey slowly to find the exact null point.",
      outOfRange: "Try to get l between 30-70 cm for better accuracy. Change the value of S."
    },
    concepts: {
      principle: "The Meter Bridge works on the Wheatstone Bridge principle. At balance: P/Q = R/S, where P and Q are the bridge wire resistances on either side of the jockey.",
      formula: "R = S × l/(100-l), where l is the balancing length from the left end, S is the known resistance.",
      specificResistance: "Specific resistance ρ = RA/L = π r² R / L, where r is the radius of the wire and L is its length."
    }
  },
  'tangent-galvanometer': {
    greeting: "Welcome to the Tangent Galvanometer experiment! Let's find the reduction factor K.",
    steps: [
      "Place the Tangent Galvanometer on the table and level it.",
      "Rotate the coil box until the coil is in the magnetic meridian (compass needle aligned with 0-0).",
      "Connect the battery, ammeter, rheostat, and commutator in series with the TG coil.",
      "Pass current and note the deflection θ₁ and θ₂ on the scale.",
      "Reverse the current using the commutator. Note θ₃ and θ₄.",
      "Calculate mean θ = (θ₁ + θ₂ + θ₃ + θ₄) / 4.",
      "Use the rheostat to change current and repeat.",
      "Calculate K = I / tan θ for each reading.",
      "Find mean K. Excellent work! 🎉"
    ],
    errors: {
      notAligned: "⚠️ The coil is not in the magnetic meridian. Rotate until the compass needle reads 0-0.",
      tooLowDeflection: "Deflection is too low. Increase the current using the rheostat.",
      tooHighDeflection: "Deflection is too high (>60°). Decrease the current. Best range is 30°-60°."
    },
    concepts: {
      principle: "When current flows through the coil, it creates a magnetic field B = μ₀nI/2r perpendicular to Earth's field Bh. The needle deflects by angle θ where tan θ = B/Bh.",
      formula: "K = I / tan θ (Reduction factor). The horizontal component Bh = μ₀nK/2r."
    }
  },
  'potentiometer': {
    greeting: "Let's compare the EMF of two cells using the Potentiometer!",
    steps: [
      "Connect the potentiometer with the battery across the full wire length.",
      "Connect cell E₁ through the DPDT switch and galvanometer.",
      "Slide the jockey to find the null point for E₁. Note length l₁.",
      "Switch to cell E₂ using the DPDT switch.",
      "Find the null point for E₂. Note length l₂.",
      "Calculate E₁/E₂ = l₁/l₂.",
      "Repeat for accuracy. The ratio should be consistent! 🎉"
    ],
    errors: {
      noNull: "⚠️ Cannot find null point. Make sure the battery EMF is greater than both cell EMFs.",
      wrongPolarity: "Check the polarity of cells. The positive terminals should be connected correctly."
    },
    concepts: {
      principle: "The fall of potential along the potentiometer wire is uniform. At the null point, the EMF of the cell equals the potential drop across length l.",
      formula: "E₁/E₂ = l₁/l₂. No current flows through the cell at balance, so internal resistance doesn't affect the result."
    }
  },
  'spectrometer': {
    greeting: "Welcome to the Spectrometer experiment! Let's find the refractive index of the prism.",
    steps: [
      "Level the spectrometer using the spirit level and leveling screws.",
      "Adjust the telescope for parallel rays (distant object method).",
      "Place the prism on the prism table.",
      "Find reflected images on both sides to determine angle A.",
      "Rotate the prism table slowly to find minimum deviation position.",
      "At minimum deviation, the refracted ray passes symmetrically through the prism.",
      "Measure the minimum deviation angle D.",
      "Calculate μ = sin((A+D)/2) / sin(A/2). 🎉"
    ],
    errors: {
      notLevel: "⚠️ The spectrometer is not level. Use the spirit level to adjust.",
      noImage: "Cannot see the image. Adjust the telescope focus and slit width."
    },
    concepts: {
      principle: "At minimum deviation, the refracted ray inside the prism is parallel to the base. The refractive index μ = sin((A+D)/2) / sin(A/2).",
      formula: "μ = sin((A+D)/2) / sin(A/2), where A is the angle of prism and D is minimum deviation."
    }
  },
  'diffraction-grating': {
    greeting: "Let's determine wavelengths using the Diffraction Grating!",
    steps: [
      "Set up the spectrometer and level it.",
      "Mount the grating on the prism table, normal to the collimator.",
      "Observe the first order spectrum on the left side.",
      "Measure the angle for each spectral color.",
      "Repeat on the right side.",
      "Calculate θ = (left - right)/2 for each color.",
      "Use λ = d sin θ to find wavelengths. 🎉"
    ],
    concepts: {
      principle: "The grating equation nλ = d sin θ relates the wavelength to the diffraction angle.",
      formula: "λ = d sin θ / n, where d = 1/N (grating element), N = lines per meter."
    }
  },
  'pn-junction-diode': {
    greeting: "Let's study the PN Junction Diode characteristics!",
    steps: [
      "Connect the diode in FORWARD bias (P to +ve, N to -ve).",
      "Slowly increase voltage from 0V using the rheostat.",
      "Note V and I readings at each step.",
      "Observe the knee voltage (≈0.7V for Silicon).",
      "After knee voltage, current increases rapidly!",
      "Now reverse the connections for REVERSE bias.",
      "Increase reverse voltage slowly. Very small current flows.",
      "Plot the V-I graph. Beautiful exponential curve! 🎉"
    ],
    errors: {
      reversed: "⚠️ Check polarity! In forward bias, connect P-side to positive terminal.",
      highVoltage: "⚠️ Don't exceed the maximum rating. The diode may get damaged!"
    },
    concepts: {
      principle: "In forward bias, the depletion region narrows and current flows after the barrier potential is overcome (0.7V for Si, 0.3V for Ge). In reverse bias, only a tiny leakage current flows.",
      formula: "I = I₀(e^(eV/kT) - 1), the Shockley diode equation."
    }
  },
  'zener-diode': {
    greeting: "Let's explore the Zener Diode and its breakdown behavior!",
    steps: [
      "Connect the Zener diode in forward bias first.",
      "It behaves like a normal diode — note readings.",
      "Now connect in REVERSE bias.",
      "Slowly increase the reverse voltage.",
      "Watch carefully — at Vz, current suddenly increases!",
      "This is the Zener breakdown — the diode conducts in reverse!",
      "Plot the V-I graph showing the breakdown region. 🎉"
    ],
    concepts: {
      principle: "Zener breakdown occurs due to strong electric field at the junction, which pulls electrons from covalent bonds. It's used for voltage regulation.",
      formula: "At breakdown: V = Vz (constant), I increases sharply."
    }
  },
  'transistor-ce': {
    greeting: "Welcome to the Transistor CE Mode experiment!",
    steps: [
      "Connect the NPN transistor in Common Emitter configuration.",
      "For INPUT characteristics: Set VCE = 1V (constant).",
      "Vary VBB and note VBE and IB readings.",
      "For OUTPUT characteristics: Set IB = 20μA (constant).",
      "Vary VCC and note VCE and IC readings.",
      "Plot both input and output characteristic curves.",
      "Calculate β = ΔIC/ΔIB from the output curve. 🎉"
    ],
    concepts: {
      principle: "In CE mode, a small base current IB controls a large collector current IC. The current gain β = IC/IB is typically 50-300.",
      formula: "β = ΔIC / ΔIB (at constant VCE). Also called hFE."
    }
  },
  'logic-gates': {
    greeting: "Let's verify Logic Gate truth tables!",
    steps: [
      "Insert the IC chip on the breadboard.",
      "Connect VCC (pin 14) to +5V and GND (pin 7) to 0V.",
      "Connect input switches to the gate input pins.",
      "Connect the output pin to an LED through a 330Ω resistor.",
      "Apply input combinations: 00, 01, 10, 11.",
      "Note the LED state (ON = 1, OFF = 0) for each.",
      "Compare with the expected truth table. 🎉"
    ],
    concepts: {
      gates: "AND (7408): Both HIGH → HIGH\nOR (7432): Any HIGH → HIGH\nNOT (7404): Inverts\nNAND (7400): NOT of AND\nNOR (7402): NOT of OR\nXOR (7486): Different inputs → HIGH"
    }
  },
  'demorgan-theorem': {
    greeting: "Let's verify De Morgan's Theorems!",
    steps: [
      "Theorem 1: Build (A+B)' using NOR gate.",
      "Build A'·B' using NOT gates + AND gate.",
      "Apply all 4 input combinations to both circuits.",
      "Verify outputs match for all cases!",
      "Theorem 2: Build (A·B)' using NAND gate.",
      "Build A'+B' using NOT gates + OR gate.",
      "Apply all 4 input combinations to both circuits.",
      "Verify outputs match — De Morgan's is proven! 🎉"
    ],
    concepts: {
      theorem1: "First theorem: (A+B)' = A'·B' — The complement of OR equals AND of complements.",
      theorem2: "Second theorem: (A·B)' = A'+B' — The complement of AND equals OR of complements."
    }
  }
};
