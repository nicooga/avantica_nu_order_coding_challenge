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
  background: #e0e2db;
  border: 3px solid #191716;
  border-radius: 8px;
`;

const SuggestionsBoxItem = styled.div`
  padding: 8px;
  box-sizing: border-box;
  cursor: pointer;

  &:not(:last-child) {
    border-bottom: 1px solid #beb7a4;
  }

  &:hover,
  &.active {
    background-color: #e6af2e;
  }
`;

const Input = styled.input`
  width: 450px;
  background: #e0e2db;
  border: 3px solid #191716;
  border-radius: 8px;
  padding: 5px 8px;
  box-sizing: border-box;

  &:focus {
    outline: none !important;
  }
`;

export { Root, SuggestionsBox, SuggestionsBoxItem, Input };
