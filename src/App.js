/* eslint-disable default-case */
import React, { useReducer } from "react";
import "./App.css";
import DigitButton from "./DigitButton";
import OperationButton from "./OperationButton";

export const ACTIONS = {
  ADD_DIGIT: "add-digit",
  DELET_DIGIT: "delete-digit",
  CLEAR: "clear",
  CHOOSE_OPERATION: "choose-operation",
  EVALUATE: "evaluate",
};

function reducer(state, { type, payload }) {
  switch (type) {
    case ACTIONS.ADD_DIGIT:
      if (state.overwrite)
        return {
          ...state,
          currentOperand: payload.digit,
          overwrite: false,
        };
      if (payload.digit === "0" && state.currentOperand === "0") return state;
      if (payload.digit === "." && state.currentOperand.includes("."))
        return state;
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${payload.digit}`,
      };
    case ACTIONS.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.perviousOperand == null)
        return state;

      if (state.perviousOperand == null)
        return {
          ...state,
          operation: payload.operation,
          perviousOperand: state.currentOperand,
          currentOperand: null,
        };

      if (state.currentOperand == null)
        return {
          ...state,
          operation: payload.operation,
        };

      return {
        ...state,
        perviousOperand: evaluate(state),
        operation: payload.operation,
        currentOperand: null,
      };
    case ACTIONS.CLEAR:
      return {};
    case ACTIONS.DELET_DIGIT:
      if (state.overwrite)
        return {
          ...state,
          currentOperand: null,
          overwrite: false,
        };
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1)
        return { ...state, currentOperand: null };
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1)
      };
    case ACTIONS.EVALUATE:
      if (
        state.perviousOperand == null ||
        state.currentOperand == null ||
        state.operation == null
      )
        return {};
      return {
        ...state,
        currentOperand: evaluate(state),
        perviousOperand: null,
        operation: null,
        overwrite: true,
      };
  }
}

function evaluate({ perviousOperand, currentOperand, operation }) {
  const prev = parseFloat(perviousOperand);
  const curr = parseFloat(currentOperand);
  if (isNaN(prev) || isNaN(curr)) return "";
  let computation = "";
  switch (operation) {
    case "+":
      computation = prev + curr;
      break;
    case "-":
      computation = prev - curr;
      break;
    case "÷":
      computation = prev / curr;
      break;
    case "*":
      computation = prev * curr;
      break;
  }
  return computation.toString();
}

const INTEGER_FORMATTER = new Intl.NumberFormat("en-us", {
  maximumFractionDigits: 0,
})

function formatOperand(operand) {
  if (operand == null) return
  const [integer, decimal] = operand.split(".");
  if (decimal == null) return INTEGER_FORMATTER.format(integer);
  return `${INTEGER_FORMATTER.format(integer)}.${decimal}`
}

function App() {
  const [{ currentOperand, perviousOperand, operation }, dispatch] = useReducer(
    reducer,
    {}
  );

  return (
    <div className="calculator-grid">
      <div className="output">
        <div className="previous-operand">
          {formatOperand(perviousOperand)} {operation}
        </div>
        <div className="current-operand">{formatOperand(currentOperand)}</div>
      </div>
      <button
        className="span-two"
        onClick={() => {
          dispatch({ type: ACTIONS.CLEAR });
        }}
      >
        AC
      </button>
      <button onClick={() => {dispatch({type: ACTIONS.DELET_DIGIT})}}>DEL</button>
      <OperationButton operation={"÷"} dispatch={dispatch}></OperationButton>
      <DigitButton digit={"7"} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"8"} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"9"} dispatch={dispatch}></DigitButton>
      <OperationButton operation={"*"} dispatch={dispatch}></OperationButton>
      <DigitButton digit={"4"} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"5"} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"6"} dispatch={dispatch}></DigitButton>
      <OperationButton operation={"+"} dispatch={dispatch}></OperationButton>
      <DigitButton digit={"1"} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"2"} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"3"} dispatch={dispatch}></DigitButton>
      <OperationButton operation={"-"} dispatch={dispatch}></OperationButton>
      <DigitButton digit={"0"} dispatch={dispatch}></DigitButton>
      <DigitButton digit={"."} dispatch={dispatch}></DigitButton>
      <button
        className="span-two"
        onClick={() => {
          dispatch({ type: ACTIONS.EVALUATE });
        }}
      >
        =
      </button>
    </div>
  );
}

export default App;
