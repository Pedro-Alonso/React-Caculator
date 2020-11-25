import './App.css';
import React, { useState } from "react";
import * as math from "mathjs";

import Author from "./components/Author/Author";
import Result from "./components/Result/Result";
import Buttons from "./components/Buttons/Buttons";

const isOperator = /[*+\-/]/,
      endsWithOperator = /[*+\-/]$/,
      startsWithOperator = /^[*+\-/]/,
      startsWithZero = /^0/;

function App() {
  const [curVal, setCurVal] = useState("0");
  const [prevVal, setPrevVal] = useState("0");
  const [maxPrevVal, setMaxPrevVal] = useState("0");
  const [operations, setOperations] = useState([]);
  const [isEvaluated, setIsEvaluated] = useState(false);

  const maxDigitWarning = () => {
    setPrevVal("MAX DIGIT LIMIT");
    setTimeout(() => {
      setCurVal(maxPrevVal);
      setPrevVal(maxPrevVal);
    }, 1000);
  }

  const handleClear = () => {
    setCurVal("0");
    setPrevVal("0");
    setMaxPrevVal("0");
    setOperations([]);
    setIsEvaluated(false);
  }

  const handleNumbers = e => {
    let val = e.target.value;

    if (!prevVal.includes("DIGIT")) {
      if (prevVal.length > 10) {
        maxDigitWarning();
      }
      else if (isEvaluated) {
        setCurVal(val);
        setPrevVal(val);
        setOperations([]);
        setIsEvaluated(false);
      }
      else {
        if (prevVal.includes(".")) {
          setCurVal(curVal + val);
          setPrevVal(prevVal + val);
        }
        else {
          let curVal_ = curVal.replace(startsWithZero, "");
          let prevVal_ = prevVal.replace(startsWithZero, "");

          if (prevVal_ === "0" && val === "0") {
            return;
          }

          if (isOperator.test(prevVal_)) {
            setPrevVal(val);
          }
          else {
            setPrevVal(prevVal_ + val);
          }

          setCurVal(curVal_ + val);
        }
      }
    }
  };

  const handleOperations = e => {
    let val = e.target.value;
    setOperations([...operations]);

    if (isEvaluated) {
      setCurVal(prevVal + val);
      setPrevVal(val);
      setOperations([val]);
      setIsEvaluated(false);
    }
    else {
      if (isOperator.test(prevVal)) {
        let slicedOps = operations.slice(0, operations.length - 1);
        setCurVal(curVal.replace(endsWithOperator, val));
        setPrevVal(val);
        setOperations([...slicedOps, val]);
      }
      else {
        if (prevVal.includes("DIGIT")) {
          return;
        }

        setCurVal(curVal + val);
        setPrevVal(val);
        setOperations([...operations, val]);
      }
    }
  };

  const handleResult = () => {
    if (isEvaluated) {
      return;
    }

    let sliced = curVal.slice();
    if (endsWithOperator.test(curVal)) {
      sliced = curVal.slice(0, curVal.length - 1);
    }
    
    let result = math.evaluate(sliced);
    setCurVal(sliced + "=" + String(result));
    setPrevVal(String(result));
    setIsEvaluated(true);
  }

  const handleDecimal = e => {
    let val = e.target.value;

    if (isEvaluated) {
      setCurVal("0" + val);
      setPrevVal("0" + val);
      setIsEvaluated(false);
    }
    else {
      if (!prevVal.includes(".") && !prevVal.includes("DIGIT")) {
        setCurVal(curVal + val);
        setPrevVal(prevVal + val);
      }
    }
  }
  
  return (
    <div id="container" className="container">
      <div className="calculator-container">
        <Result head={curVal} result={prevVal} />
        <Buttons
          clears={handleClear}
          numbers={handleNumbers}
          operations={handleOperations}
          decimal={handleDecimal}
          result={handleResult}
        />
      </div>
      <Author 
        name="Pedro Alonso"
        github="https://github.com/Pedro-Alonso"
      />
    </div>
  );
}

export default App;
