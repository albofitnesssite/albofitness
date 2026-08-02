import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import albologo from '/src/assets/albo.PNG';

function log10(x) {
  return Math.log(x) / Math.LN10;
}

const ACTIVITY_LEVELS = [
  { id: 'sedentary', label: 'Sedentary (Little or no exercise)', factor: 1.2 },
  { id: 'light', label: 'Lightly active (Light exercise 1-3 days/week)', factor: 1.375 },
  { id: 'moderate', label: 'Moderately active (Moderate exercise 3-5 days/week)', factor: 1.55 },
  { id: 'active', label: 'Very active (Hard exercise 6-7 days/week)', factor: 1.725 },
  { id: 'extra', label: 'Extra active (Very hard exercise & physical job)', factor: 1.9 },
];

export default function Calculator() {
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [weight, setWeight] = useState('');
  const [neck, setNeck] = useState('');
  const [neckUnit, setNeckUnit] = useState('cm');
  const [waist, setWaist] = useState('');
  const [waistUnit, setWaistUnit] = useState('cm');
  const [hip, setHip] = useState('');
  const [heightUnit, setHeightUnit] = useState('cm');
  const [heightCm, setHeightCm] = useState('');
  const [heightFt, setHeightFt] = useState('');
  const [heightIn, setHeightIn] = useState('');
  const [activity, setActivity] = useState('sedentary');

  const [result, setResult] = useState(null);
  const [error, setError] = useState('');

  const toCm = (val, unit) => (unit === 'in' ? parseFloat(val) * 2.54 : parseFloat(val));

  const calculate = () => {
    const ageNum = parseFloat(age);
    const weightKg = parseFloat(weight);
    const neckCm = toCm(neck, neckUnit);
    const waistCm = toCm(waist, waistUnit);
    const heightInCm =
      heightUnit === 'cm' ? parseFloat(heightCm) : parseFloat(heightFt) * 30.48 + parseFloat(heightIn || 0) * 2.54;
    const hipCm = parseFloat(hip);

    if (!ageNum || !gender || !weightKg || !neckCm || !waistCm || !heightInCm) {
      setError('Please fill in all fields.');
      setResult(null);
      return;
    }
    if (gender === 'female' && !hipCm) {
      setError('Hip measurement is required for the female body-fat calculation.');
      setResult(null);
      return;
    }
    setError('');

    const heightM = heightInCm / 100;
    const bmi = weightKg / (heightM * heightM);

    let bmr = 10 * weightKg + 6.25 * heightInCm - 5 * ageNum;
    bmr += gender === 'male' ? 5 : -161;

    let bodyFat;
    if (gender === 'male') {
      bodyFat = 495 / (1.0324 - 0.19077 * log10(waistCm - neckCm) + 0.15456 * log10(heightInCm)) - 450;
    } else {
      bodyFat = 495 / (1.29579 - 0.35004 * log10(waistCm + hipCm - neckCm) + 0.221 * log10(heightInCm)) - 450;
    }

    // Ideal body weight — Devine formula
    const heightInInches = heightInCm / 2.54;
    const inchesOver5ft = heightInInches - 60;
    const idealWeight =
      gender === 'male' ? 50 + 2.3 * inchesOver5ft : 45.5 + 2.3 * inchesOver5ft;

    const weightDiff = idealWeight - weightKg;

    setResult({
      bmi: bmi.toFixed(2),
      bmr,
      bodyFat: bodyFat.toFixed(2),
      idealWeight: idealWeight.toFixed(2),
      weightDiff: Math.abs(weightDiff).toFixed(2),
      direction: weightDiff >= 0 ? 'Increase' : 'Decrease',
    });
  };

  const inputClass =
    'w-full bg-white border border-gray-300 rounded-md px-4 py-3 text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors';
  const labelClass = 'block font-semibold text-gray-900 mb-2';
  const unitInputClass =
    'w-full bg-white border border-gray-300 rounded-l-md px-4 py-3 text-gray-900 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-colors';
  const unitTagClass =
    'flex items-center px-4 bg-gray-100 border border-l-0 border-gray-300 rounded-r-md font-medium text-gray-600';
  const unitSelectClass =
    'bg-gray-100 border border-l-0 border-gray-300 rounded-r-md px-3 font-medium text-gray-600 focus:outline-none';

  const activityFactor = ACTIVITY_LEVELS.find((a) => a.id === activity).factor;
  const maintainCal = result ? result.bmr * activityFactor : 0;

  return (
    <div className="bg-black text-white min-h-screen">
      {/* Header */}
      <header className="bg-black text-white sticky top-0 z-50 border-b-2 border-orange-500">
        <nav className="max-w-7xl mx-auto px-4 py-6 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <img src={albologo} alt="ALBO FITNESS" className="h-10 w-auto" />
          </Link>
          <Link
            to="/"
            className="flex items-center gap-2 text-gray-300 hover:text-white font-medium transition-colors"
          >
            <ArrowLeft size={18} />
            Back to Home
          </Link>
        </nav>
      </header>

      <style>{`
        .calc-card input,
        .calc-card select {
          background: #ffffff !important;
          color: #111111 !important;
          border-color: #d1d5db !important;
          border-radius: 6px !important;
        }
        .calc-card input:focus,
        .calc-card select:focus {
          border-color: #ea580c !important;
        }
        .calc-card input::placeholder {
          color: #9ca3af !important;
        }
        .calc-card h1 {
          color: #111111 !important;
        }
      `}</style>

      <main className="max-w-2xl mx-auto px-4 py-12">
        <div className="calc-card bg-white text-gray-900 rounded-2xl shadow-2xl p-8 md:p-10">
          <h1 className="text-2xl md:text-3xl font-bold text-center mb-8">Fitness Calculator</h1>

          <div className="grid grid-cols-2 gap-4 mb-5">
            <div>
              <label className={labelClass}>Age</label>
              <input type="number" value={age} onChange={(e) => setAge(e.target.value)} placeholder="Age" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Gender</label>
              <select value={gender} onChange={(e) => setGender(e.target.value)} className={inputClass}>
                <option value="">Gender</option>
                <option value="male">Male</option>
                <option value="female">Female</option>
              </select>
            </div>
          </div>

          <div className="mb-5">
            <label className={labelClass}>Weight</label>
            <div className="flex">
              <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight" className={unitInputClass} />
              <span className={unitTagClass}>kg</span>
            </div>
          </div>

          <div className="mb-5">
            <label className={labelClass}>Neck</label>
            <div className="flex">
              <input type="number" value={neck} onChange={(e) => setNeck(e.target.value)} className={unitInputClass} />
              <select value={neckUnit} onChange={(e) => setNeckUnit(e.target.value)} className={unitSelectClass}>
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>

          <div className="mb-5">
            <label className={labelClass}>Waist</label>
            <div className="flex">
              <input type="number" value={waist} onChange={(e) => setWaist(e.target.value)} className={unitInputClass} />
              <select value={waistUnit} onChange={(e) => setWaistUnit(e.target.value)} className={unitSelectClass}>
                <option value="cm">cm</option>
                <option value="in">in</option>
              </select>
            </div>
          </div>

          {gender === 'female' && (
            <div className="mb-5">
              <label className={labelClass}>Hip</label>
              <div className="flex">
                <input type="number" value={hip} onChange={(e) => setHip(e.target.value)} className={unitInputClass} />
                <span className={unitTagClass}>cm</span>
              </div>
              <p className="text-xs text-gray-500 mt-1">Needed for an accurate female body-fat estimate.</p>
            </div>
          )}

          <div className="mb-6">
            <div className="flex items-center gap-6 mb-2">
              <label className={labelClass + ' mb-0'}>Height in</label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-800">
                <input type="radio" name="heightUnit" checked={heightUnit === 'cm'} onChange={() => setHeightUnit('cm')} className="accent-orange-500" />
                Centimeters
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-gray-800">
                <input type="radio" name="heightUnit" checked={heightUnit === 'ft'} onChange={() => setHeightUnit('ft')} className="accent-orange-500" />
                Feet
              </label>
            </div>

            {heightUnit === 'cm' ? (
              <div className="flex">
                <input type="number" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} className={unitInputClass} />
                <span className={unitTagClass}>cm</span>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3">
                <div className="flex">
                  <input type="number" value={heightFt} onChange={(e) => setHeightFt(e.target.value)} className={unitInputClass} />
                  <span className={unitTagClass}>ft</span>
                </div>
                <div className="flex">
                  <input type="number" value={heightIn} onChange={(e) => setHeightIn(e.target.value)} className={unitInputClass} />
                  <span className={unitTagClass}>in</span>
                </div>
              </div>
            )}
          </div>

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <button
            onClick={calculate}
            className="w-full bg-orange-600 hover:bg-orange-700 text-white font-bold py-3.5 rounded-md transition-colors"
          >
            Calculate
          </button>

          {result && (
            <div className="mt-8 pt-8 border-t border-gray-200">
              {/* Ideal weight delta */}
              <div className="border-2 border-purple-800 rounded-lg py-6 text-center mb-6">
                <p className="text-purple-800 font-bold text-lg">{result.direction}</p>
                <p className="text-purple-800 font-bold text-2xl mt-1">{result.weightDiff} Kg</p>
              </div>

              <div className="text-center mb-6">
                <p className="font-semibold text-gray-900">Ideal body weight</p>
                <p className="text-purple-800 font-bold text-xl mt-1">{result.idealWeight} Kg</p>
              </div>

              <div className="text-center mb-6">
                <p className="font-semibold text-gray-900">Body Mass Index (BMI)</p>
                <p className="text-purple-800 font-bold text-xl mt-1">{result.bmi}</p>
                <p className="text-purple-700 text-sm mt-0.5">Healthy BMI Range 18.5 - 25</p>
              </div>

              <div className="text-center mb-6">
                <p className="font-semibold text-gray-900">Basal Metabolic Rate (BMR)</p>
                <p className="text-purple-800 font-bold text-xl mt-1">{Math.round(result.bmr * 100) / 100} Calories/Day</p>
                <p className="text-purple-700 text-sm mt-0.5">Mifflin-St Jeor Method</p>
              </div>

              <div className="text-center mb-8">
                <p className="font-semibold text-gray-900">Body Fat Percentage</p>
                <p className="text-purple-800 font-bold text-xl mt-1">{result.bodyFat}%</p>
                <p className="text-purple-700 text-sm mt-0.5">Normal men 14% - 24%</p>
                <p className="text-purple-700 text-sm">Normal women 21% - 31%</p>
              </div>

              <h2 className="text-purple-800 font-bold text-lg mb-3">Recommended calories per day</h2>

              <div className="mb-4">
                <label className={labelClass}>Activity type</label>
                <select value={activity} onChange={(e) => setActivity(e.target.value)} className={inputClass}>
                  {ACTIVITY_LEVELS.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="font-semibold text-gray-900">Maintain weight</p>
                  <p className="text-purple-800 font-bold">{Math.round(maintainCal * 100) / 100}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Mild Weight Loss</p>
                    <p className="text-gray-500 text-xs">(0.25 kg/week Approx.)</p>
                  </div>
                  <p className="text-purple-800 font-bold">{Math.round(maintainCal * 0.9 * 100) / 100}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Heavy Weight Loss</p>
                    <p className="text-gray-500 text-xs">(0.50 kg/week Approx.)</p>
                  </div>
                  <p className="text-purple-800 font-bold">{Math.round(maintainCal * 0.8 * 100) / 100}</p>
                </div>
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-gray-900">Extreme Weight Loss</p>
                    <p className="text-gray-500 text-xs">(0.75 kg/week Approx.)</p>
                  </div>
                  <p className="text-purple-800 font-bold">{Math.round(maintainCal * 0.7 * 100) / 100}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        <p className="text-center text-gray-500 text-xs mt-6">
          Estimates only, not medical advice. Body fat uses the US Navy method.
        </p>
      </main>
    </div>
  );
}
