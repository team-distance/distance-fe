import React from 'react';
import styled from 'styled-components';

const Slider = ({ ...props }) => {
  return (
    <SliderContainer>
      <SliderRail />
      <SliderTick
        style={{ left: 'calc(100 / 6 * 0%)' }}
        data-distance="1"
        data-value={props.value}
      />
      <SliderTick
        style={{ left: 'calc(100 / 6 * 1%)' }}
        data-distance="5"
        data-value={props.value}
      />
      <SliderTick
        style={{ left: 'calc(100 / 6 * 2%)' }}
        data-distance="10"
        data-value={props.value}
      />
      <SliderTick
        style={{ left: 'calc(100 / 6 * 3%)' }}
        data-distance="15"
        data-value={props.value}
      />
      <SliderTick
        style={{ left: 'calc(100 / 6 * 4%)' }}
        data-distance="20"
        data-value={props.value}
      />
      <SliderTick
        style={{ left: 'calc(100 / 6 * 5%)' }}
        data-distance="25"
        data-value={props.value}
      />
      <SliderTick
        style={{ left: 'calc(100 / 6 * 6%)' }}
        data-distance="30"
        data-value={props.value}
      />
      <SliderFillTrack fill={`${(props.value / 30000) * 100}%`} />
      <Input type="range" min="0" max="30000" step={5000} {...props} />
    </SliderContainer>
  );
};

const SliderContainer = styled.div`
  width: 100%;
  height: 54px;
  position: relative;
`;

const SliderTick = styled.div`
  width: 1px;
  height: 20px;
  background-color: #d3d3d3;
  position: absolute;
  top: calc(50% - 10px);
  font-size: 10px;
  font-weight: 300;
  color: #d3d3d3;

  &::after {
    content: attr(data-distance) 'km';
    width: 1px;
    height: 10px;
    position: absolute;
    top: 30px;
    left: -10px;
    color: ${(props) =>
      props['data-value'] >= props['data-distance'] * 1000 && '#333333'};
  }
`;

const SliderRail = styled.div`
  width: calc(100%);
  height: 1px;
  border-radius: 2px;
  background-color: #d3d3d3;
  position: absolute;
  top: calc(50%);
`;

const SliderFillTrack = styled.div`
  width: ${(props) => props.fill};
  height: 1px;
  border-radius: 2px;
  background-color: #ff625d;
  position: absolute;
  top: calc(50%);
`;

const Input = styled.input`
  position: absolute;
  top: calc(50% - 6px);
  width: 100%;
  height: 12px;
  -webkit-appearance: none;
  background: transparent;
  filter: blur(0.5px);
  margin: 0;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    appearance: none;
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #ff625d;
    filter: blur(0.5px);
  }

  &:active {
    cursor: grabbing;
  }

  &:focus {
    outline: none;
  }
`;

export default Slider;
