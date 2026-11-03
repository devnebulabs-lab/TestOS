import React, { useState } from 'react';
import { sounds } from '../../utils/sound';
import { Delete } from 'lucide-react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevValue, setPrevValue] = useState<string | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

  const handleDigit = (digit: string) => {
    sounds.click();
    if (display === '0' || resetNext) {
      setDisplay(digit);
      setResetNext(false);
    } else {
      if (display.length < 12) {
        setDisplay(display + digit);
      }
    }
  };

  const handleDecimal = () => {
    sounds.click();
    if (resetNext) {
      setDisplay('0.');
      setResetNext(false);
      return;
    }
    if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const handleOp = (op: string) => {
    sounds.click();
    setPrevValue(display);
    setOperation(op);
    setResetNext(true);
  };

  const handleCalculate = () => {
    sounds.click();
    if (!operation || prevValue === null) return;
    const a = parseFloat(prevValue);
    const b = parseFloat(display);
    let result = 0;

    switch (operation) {
      case '+':
        result = a + b;
        break;
      case '-':
        result = a - b;
        break;
      case '×':
        result = a * b;
        break;
      case '÷':
        result = b !== 0 ? a / b : 0;
        break;
    }

    const formatted = parseFloat(result.toFixed(8)).toString();
    setDisplay(formatted);
    setPrevValue(null);
    setOperation(null);
    setResetNext(true);
  };

  const handleClear = () => {
    sounds.haptic();
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setResetNext(false);
  };

  const handlePercent = () => {
    sounds.click();
    const val = parseFloat(display) / 100;
    setDisplay(val.toString());
  };

  const handleToggleSign = () => {
    sounds.click();
    const val = parseFloat(display) * -1;
    setDisplay(val.toString());
  };

  const handleBackspace = () => {
    sounds.click();
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  return (
    <div className="flex-1 flex flex-col bg-slate-950 text-white select-none p-5 justify-between">
      {/* Display Screen */}
      <div className="flex-1 flex flex-col justify-end items-end pb-6 px-2">
        {prevValue !== null && operation && (
          <span className="text-sm font-mono text-white/50 mb-1">
            {prevValue} {operation}
          </span>
        )}
        <div className="text-4xl font-light font-mono tracking-tight text-white truncate max-w-full">
          {display}
        </div>
      </div>

      {/* Keypad */}
      <div className="grid grid-cols-4 gap-2.5">
        <button
          onClick={handleClear}
          className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-rose-400 font-semibold text-lg transition-all"
        >
          C
        </button>
        <button
          onClick={handleToggleSign}
          className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 font-semibold text-lg transition-all"
        >
          ±
        </button>
        <button
          onClick={handlePercent}
          className="h-14 rounded-2xl bg-white/10 hover:bg-white/20 active:scale-95 text-white/80 font-semibold text-lg transition-all"
        >
          %
        </button>
        <button
          onClick={() => handleOp('÷')}
          className={`h-14 rounded-2xl font-bold text-lg active:scale-95 transition-all ${
            operation === '÷'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
          }`}
        >
          ÷
        </button>

        <button
          onClick={() => handleDigit('7')}
          className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-white text-lg font-medium transition-all"
        >
          7
        </button>
        <button
          onClick={() => handleDigit('8')}
          className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-white text-lg font-medium transition-all"
        >
          8
        </button>
        <button
          onClick={() => handleDigit('9')}
          className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-white text-lg font-medium transition-all"
        >
          9
        </button>
        <button
          onClick={() => handleOp('×')}
          className={`h-14 rounded-2xl font-bold text-lg active:scale-95 transition-all ${
            operation === '×'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
          }`}
        >
          ×
        </button>

        <button
          onClick={() => handleDigit('4')}
          className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-white text-lg font-medium transition-all"
        >
          4
        </button>
        <button
          onClick={() => handleDigit('5')}
          className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-white text-lg font-medium transition-all"
        >
          5
        </button>
        <button
          onClick={() => handleDigit('6')}
          className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-white text-lg font-medium transition-all"
        >
          6
        </button>
        <button
          onClick={() => handleOp('-')}
          className={`h-14 rounded-2xl font-bold text-lg active:scale-95 transition-all ${
            operation === '-'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
          }`}
        >
          -
        </button>

        <button
          onClick={() => handleDigit('1')}
          className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-white text-lg font-medium transition-all"
        >
          1
        </button>
        <button
          onClick={() => handleDigit('2')}
          className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-white text-lg font-medium transition-all"
        >
          2
        </button>
        <button
          onClick={() => handleDigit('3')}
          className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-white text-lg font-medium transition-all"
        >
          3
        </button>
        <button
          onClick={() => handleOp('+')}
          className={`h-14 rounded-2xl font-bold text-lg active:scale-95 transition-all ${
            operation === '+'
              ? 'bg-amber-400 text-slate-950 shadow-md'
              : 'bg-amber-500 hover:bg-amber-400 text-slate-950'
          }`}
        >
          +
        </button>

        <button
          onClick={() => handleDigit('0')}
          className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-white text-lg font-medium transition-all"
        >
          0
        </button>
        <button
          onClick={handleDecimal}
          className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-white text-lg font-medium transition-all"
        >
          .
        </button>
        <button
          onClick={handleBackspace}
          className="h-14 rounded-2xl bg-white/5 hover:bg-white/10 active:scale-95 text-white/70 flex items-center justify-center transition-all"
          title="Backspace"
        >
          <Delete className="w-5 h-5" />
        </button>
        <button
          onClick={handleCalculate}
          className="h-14 rounded-2xl bg-sky-500 hover:bg-sky-400 active:scale-95 text-white font-bold text-xl shadow-lg shadow-sky-500/20 transition-all"
        >
          =
        </button>
      </div>
    </div>
  );
};
