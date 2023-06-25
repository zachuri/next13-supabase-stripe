import { Price } from "@/types/stripe"

export const postData = async ({
  url,
  data,
}: {
  url: string
  data?: { price: Price }
}) => {
  console.log("posting,", url, data)

  const res: Response = await fetch(url, {
    method: "POST",
    headers: new Headers({ "Content-Type": "application/json" }),
    credentials: "same-origin",
    body: JSON.stringify(data),
  })

  if (!res.ok) {
    console.log("Error in postData", { url, data, res })

    throw Error(res.statusText)
  }

  return res.json()
}

export const toDateTime = (secs: number) => {
  var t = new Date("1970-01-01T00:30:00Z") // Unix epoch start.
  t.setSeconds(secs)
  return t
}
