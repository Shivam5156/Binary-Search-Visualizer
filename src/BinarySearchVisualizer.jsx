import React, { useState, useEffect } from "react";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

const BinarySearchVisualization = () => {
  const [nums, setNums] = useState([1, 3, 5, 7, 9, 11]);
  const [target, setTarget] = useState(7);

  const [low, setLow] = useState(0);
  const [high, setHigh] = useState(nums.length - 1);
  const [mid, setMid] = useState(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [found, setFound] = useState(null);

  const [history, setHistory] = useState([]);
  const [error, setError] = useState("");

  const [customInput, setCustomInput] = useState("");
  const [customTarget, setCustomTarget] = useState("");

  const [currentCaseIndex, setCurrentCaseIndex] = useState(0);
  const [testCases, setTestCases] = useState([
    { nums: [1, 3, 5, 7, 9, 11], target: 7 },
    { nums: [2, 4, 6, 8, 10], target: 10 },
    { nums: [1, 2, 3, 4, 5], target: 6 },
  ]);

  const [showFlowChart, setShowFlowChart] = useState(false);

  const isSorted = (arr) => {
    for (let i = 1; i < arr.length; i++) {
      if (arr[i] < arr[i - 1]) return false;
    }
    return true;
  };

  const stepForward = () => {
    if (low > high) {
      setIsPlaying(false);
      setFound(-1);
      return;
    }

    if (found !== null) return;

    const m = Math.floor((low + high) / 2);
    setMid(m);

    setHistory((prev) => [...prev, { low, high, mid: m }]);

    if (nums[m] === target) {
      setFound(m);
      setIsPlaying(false);
      return;
    }

    if (nums[m] < target) setLow(m + 1);
    else setHigh(m - 1);
  };

  const stepBack = () => {
    if (history.length === 0) return;

    const newHistory = [...history];
    const last = newHistory.pop();

    setHistory(newHistory);

    if (last) {
      setLow(last.low);
      setHigh(last.high);
      setMid(last.mid);
    }
  };

  useEffect(() => {
    let timer;
    if (isPlaying) {
      timer = setTimeout(() => stepForward(), 1000);
    }
    return () => clearTimeout(timer);
  }, [isPlaying, low, high]);

  const reset = (arr = nums, tgt = target) => {
    setNums(arr);
    setTarget(tgt);
    setLow(0);
    setHigh(arr.length - 1);
    setMid(null);
    setHistory([]);
    setFound(null);
    setIsPlaying(false);
    setError("");
  };

  const handleReset = () => {
    if (testCases[currentCaseIndex]) {
      const { nums: n, target: t } = testCases[currentCaseIndex];
      reset(n, t);
    } else {
      reset(nums, target);
    }
  };

  const runTestCase = (index) => {
    const { nums: n, target: t } = testCases[index];
    setCurrentCaseIndex(index);
    setNums(n);
    setTarget(t);
    reset(n, t);
  };

  const addCustomTestCase = () => {
    if (!customInput.trim() || !customTarget.trim()) {
      setError("Array and Target cannot be empty");
      return;
    }

    const arr = customInput.split(",").map(Number);
    const tgt = Number(customTarget);

    if (arr.some(isNaN) || isNaN(tgt)) {
      setError("Invalid input (numbers only)");
      return;
    }

    if (!isSorted(arr)) {
      setError("Array must be sorted in ascending order");
      return;
    }

    setError("");

    const newCases = [...testCases, { nums: arr, target: tgt }];
    setTestCases(newCases);

    const newIndex = newCases.length - 1;
    setCurrentCaseIndex(newIndex);
    reset(arr, tgt);

    setCustomInput("");
    setCustomTarget("");
  };

  return (
    <div className="min-h-screen bg-linear-to-br from-gray-950 via-gray-900 to-black text-white flex justify-center p-6">
      
      <div className="w-full max-w-5xl flex flex-col gap-8 items-center bg-gray-900/40 backdrop-blur-xl p-6 rounded-3xl border border-gray-700 shadow-2xl">

        {/* Header */}
        <div className="w-full flex flex-col md:flex-row items-center justify-between gap-4 border-b border-gray-700 pb-4">
          
          <h1 className="text-3xl md:text-4xl font-extrabold text-purple-400 tracking-wide">
            Binary Search Visualization
          </h1>

          <button
            onClick={() => setShowFlowChart(true)}
            className="px-5 py-2 bg-linear-to-r from-purple-600 to-indigo-500 rounded-lg hover:scale-105 transition shadow-lg cursor-pointer"
          >
            View Flow Chart
          </button>
        </div>

        {/* Modal */}
        {showFlowChart && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black/70">
            <div className="bg-gray-900 p-4 rounded-xl border border-gray-700 shadow-xl relative w-[95%] max-w-5xl">
              
              <button
                onClick={() => setShowFlowChart(false)}
                className="absolute top-2 right-2 text-white bg-red-500 px-3 py-1 rounded hover:bg-red-400"
              >
                ✕
              </button>

              <div className="w-full flex items-center justify-center">
                <img
                  src="/Binary-Search.svg"
                  alt="Flow Chart"
                  className="max-w-full max-h-[75vh] object-contain"
                />
              </div>

              <p className="text-center text-sm text-gray-400 mt-2">
                Flowchart View
              </p>
            </div>
          </div>
        )}

        {/* Inputs */}
        <div className="w-full bg-gray-800/60 p-5 rounded-2xl shadow-lg flex gap-4 flex-wrap border border-gray-700 justify-center">
          <input
            className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            value={nums.join(",")}
            onChange={(e) =>
              setNums(e.target.value.split(",").map(Number))
            }
          />

          <input
            className="px-4 py-2 bg-gray-900 border border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none transition"
            value={target}
            onChange={(e) => setTarget(Number(e.target.value))}
          />
        </div>

        {/* Custom Test */}
        <div className="w-full bg-gray-800/60 p-5 rounded-2xl flex gap-3 flex-wrap border border-gray-700 justify-center">
          
          <input
            placeholder="Array"
            className="px-4 py-2 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
          />

          <input
            placeholder="Target"
            className="px-4 py-2 bg-gray-900 border rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
            value={customTarget}
            onChange={(e) => setCustomTarget(e.target.value)}
          />

          <button
            className="px-5 py-2 bg-green-500 rounded-lg hover:bg-green-400 hover:scale-105 transition shadow-md cursor-pointer"
            onClick={addCustomTestCase}
          >
            Add
          </button>
        </div>

        {error && (
          <div className="text-red-400 bg-gray-800 px-5 py-2 rounded-lg border border-red-500 shadow-md">
            {error}
          </div>
        )}

        {/* Test Cases */}
        <div className="flex gap-3 flex-wrap justify-center ">
          {testCases.map((_, i) => (
            <button
              key={i}
              className="px-5 py-2 bg-blue-600 rounded-lg hover:bg-blue-500 hover:scale-105 transition shadow-md cursor-pointer"
              onClick={() => runTestCase(i)}
            >
              Case {i + 1}
            </button>
          ))}
        </div>

        {/* Array */}
        <div className="flex gap-6 flex-wrap justify-center">
          {nums.map((num, index) => (
            <div
              key={index}
              className={`w-16 h-16 flex items-center justify-center rounded-xl font-bold shadow-md transition-all duration-300
              ${index === mid ? "bg-yellow-400 text-black scale-110" : "bg-gray-700"}
              ${index >= low && index <= high ? "bg-blue-600" : ""}
              ${found === index ? "bg-green-500 scale-110" : ""}
            `}
            >
              {num}
            </div>
          ))}
        </div>

        {/* Controls */}
        <div className="flex gap-5 flex-wrap justify-center mt-2">
          
          <button onClick={stepBack} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 hover:scale-110 transition shadow-md cursor-pointer">
            <SkipBack />
          </button>

          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="p-3 bg-purple-600 rounded-full hover:bg-purple-500 hover:scale-110 transition shadow-md cursor-pointer"
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>

          <button onClick={stepForward} className="p-3 bg-gray-800 rounded-full hover:bg-gray-700 hover:scale-110 transition shadow-md cursor-pointer">
            <SkipForward />
          </button>

          <button
            onClick={handleReset}
            className="px-5 py-2 bg-red-500 rounded-lg hover:bg-red-400 hover:scale-105 transition shadow-md cursor-pointer"
          >
            Reset
          </button>
        </div>

        {/* Result */}
        {found !== null && (
          <div className="text-green-400 text-lg font-semibold px-6 py-3 rounded-xl bg-gray-800 border border-green-500 shadow-lg">
            {found === -1 ? "❌ Target Not Found" : <>Found at index {found}</>}
          </div>
        )}

      </div>
    </div>
  );
};

export default BinarySearchVisualization;