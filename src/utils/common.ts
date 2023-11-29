type InputObject = { [key: string]: string[] }
type OutputObject = { [key: string]: string[] }

export const parseFieldsFormData = (inputObject: InputObject) => {
  const outputObject: OutputObject = {}

  Object.keys(inputObject).forEach((key) => {
    const matches = key.match(/^(\w+)\[(\d+)\]$/)

    if (matches) {
      const name: string = matches[1]
      const index: number = parseInt(matches[2])

      if (!outputObject[name]) {
        outputObject[name] = []
      }

      outputObject[name][index] = inputObject[key][0]
    }
  })

  return outputObject
}
