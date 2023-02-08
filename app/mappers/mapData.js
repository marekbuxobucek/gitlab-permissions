export default function (fnObjMapper, data) {
  if (!data) return null

  if (Array.isArray(data)) {
    let response = []

    for (let obj of data) {
      response.push(fnObjMapper(obj))
    }

    return response
  }

  return fnObjMapper(data)
}