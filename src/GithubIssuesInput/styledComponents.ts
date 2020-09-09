import styled from "styled-components";

const Root = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
  font-size: 18px;
`;

const SuggestionsBox = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  width: 100%;
  top: 100%;
  z-index: 1;
  overflow: hidden;
  border: 1px solid lightgrey;
  box-sizing: border-box;
  background: white;
`;

const SuggestionsBoxItem = styled.div`
  padding: 8px;
  box-sizing: border-box;
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid lightgrey;
  }

  &:hover,
  &.active {
    background-color: tomato;
  }
`;

const Input = styled.input`
  width: 450px;
  border: 1px solid: lightgrey;
  padding: 5px 8px;
  box-sizing: border-box;
`;

export { Root, SuggestionsBox, SuggestionsBoxItem, Input };
