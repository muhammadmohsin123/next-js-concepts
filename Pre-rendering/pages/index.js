import axios from "axios";
import { useEffect, useState } from "react";
import path from "path";
import fs from "fs/promises";
export default function Home({
  prefetchedtasks,
  prefetchedPresents,
  prefetchedProducts,
}) {
  const [tasks, setTasks] = useState(prefetchedtasks);
  const [loading, setLoading] = useState(false);
  const [present, setPresent] = useState(prefetchedPresents);
  const [product, setProduct] = useState(prefetchedProducts);
  const configuration = (endpoit) => {
    const config = {
      method: "get",
      url: `https://api.remoty.dev/${endpoit}?team=T012AK3MCCB`,
      headers: { token: "pjh6*46cd/;ndy903*#$21@kqu)[98" },
    };
    return config;
  };
  console.log("present ", present);
  useEffect(async () => {
    try {
      const response = await axios.get("./data.json");
      if (response.status === 200) {
        setProduct(response.data.products);
      }

      const responsePresent = await axios(configuration("present-users"));
      if (responsePresent.status === 200) {
        setPresent(responsePresent.data.users);
        setLoading(false);
      }
      const responseBoard = await axios(configuration("board-tasks"));
      if (responseBoard.status === 200) {
        setTasks(responseBoard.data.tasks);
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
    }
  }, [loading]);

  if (loading) {
    return <h1>Loading....</h1>;
  }
  console.log(" product", product.length);
  return (
    <div>
      <h1>Tasks</h1>
      <div>
        {tasks.todo_tasks.length > 0 &&
          tasks?.todo_tasks.map((el) => (
            <ul key={el.taskName}>
              <li>{el.taskName}</li>
            </ul>
          ))}
      </div>
      <h1>Presents</h1>
      {present.length > 0 &&
        present.map((el) => (
          <ul key={el.realName}>
            <li>{el.realName}</li>
          </ul>
        ))}
      <h1>Products</h1>
      {product.length > 0 &&
        product.map((el) => (
          <ul key={el.id}>
            <li>{el.title}</li>
          </ul>
        ))}
    </div>
  );
}

//Getting data from json
async function getData() {
  const filePath = path.join(process.cwd(), "public", "data.json");
  const jsonData = await fs.readFile(filePath);
  const data = JSON.parse(jsonData);
  return data;
}

export async function getStaticProps(context) {
  const configuration = (endpoit) => {
    const config = {
      method: "get",
      url: `https://api.remoty.dev/${endpoit}?team=T012AK3MCCB`,
      headers: { token: "pjh6*46cd/;ndy903*#$21@kqu)[98" },
    };
    return config;
  };

  const responseBoard = await axios(configuration("board-tasks"));
  const responsePresent = await axios(configuration("present-users"));
  const data = await getData();
  return {
    props: {
      prefetchedtasks: responseBoard.data.tasks,
      prefetchedPresents: responsePresent.data.users,
      prefetchedProducts: data.products,
    },
    revalidate: 5,
  };
}
