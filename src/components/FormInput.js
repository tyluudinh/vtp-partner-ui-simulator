import React, { useEffect, useRef } from 'react'

function FormInput(props) {

  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.value = props.value;
    }
  }, [props.name, props.value])

  return (
    <div style={{ marginBottom: "10px", display: 'flex', flexWrap: 'wrap' }}>
      <label style={{ fontWeight: 500 }} htmlFor={props.name}>{props.label}:</label>
      <input
        type="text"
        id={props.name}
        ref={ref}
        name={props.name}
        defaultValue={props.value}
        onChange={(e) => props.onChange({
          [props.name]: e.target.value
        })}
        style={{ width: "100%", padding: "8px", marginTop: "5px" }}
        required
      />
    </div>
  )
}

export default FormInput