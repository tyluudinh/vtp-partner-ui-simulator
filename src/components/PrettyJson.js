import JsonFormatter from 'react-json-formatter'

const PrettyJson = ({ data }) => {
  const jsonStyle = {
    propertyStyle: { color: 'red' },
    stringStyle: { color: 'green' },
    numberStyle: { color: 'darkorange' }
  }

  return <JsonFormatter jsonClassName={{ className: 'json-formatter'}} json={data} tabWith={4} jsonStyle={jsonStyle} />

}

export default PrettyJson;