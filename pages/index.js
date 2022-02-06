import cx from "classnames";
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { useSession, signIn, signOut } from "next-auth/react";

import styles from "../styles/Home.module.css";

const Home = () => {
  const { data: session } = useSession();
  const [todoItem, setTodoItem] = useState("");
  const [items, setItems] = useState([]);

  useEffect(() => {
    const run = async () => {
      if (session) {
        let response = await populateList(session.user.email);
        setItems(response);
      }
    };
    run();
  }, [session]);

  const populateList = async (email) => {
    return await (
      await fetch("http://localhost:5000", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      })
    ).json();
  };

  const addTodo = async (todo) => {
    await (
      await fetch("http://localhost:5000/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(todo),
      })
    ).json();
  };

  const handleEnter = (event) => {
    if (event.key === "Enter") {
      handleAdd();
    }
  };

  const handleAdd = () => {
    if (todoItem) {
      const id = uuidv4();
      setItems([
        {
          id,
          message: todoItem,
          done: false,
        },
        ...items,
      ]);
      addTodo({
        id,
        message: todoItem,
        done: false,
        email: session.user.email,
      });
      setTodoItem("");
    }
  };

  const doneToggle = async (id) => {
    await (await fetch("http://localhost:5000/" + id)).json();
  };

  const doneToggle = async (id) => {
    await (await fetch("http://localhost:5000/" + id)).json();
  }

  const handleDone = (id) => {
    const _items = items.map((item) => {
      if (item.id === id) {
        doneToggle(item.id);
        return {
          ...item,
          done: !item.done,
        };
      }
      return item;
    });
    setItems(_items);
  };

  const removeItem = (id) => {
    const arrayCpy = items;
    let idx = -1;
    for (let i = 0; i < arrayCpy.length; i++)
      if (arrayCpy[i].id === id) idx = i;
    arrayCpy.splice(idx, 1);
    setItems([...arrayCpy]);
    deleteItem(id);
  };

  const deleteItem = async (id) => {
    const response = await (
      await fetch("http://localhost:5000/" + id, {
        method: "DELETE",
      })
    ).json();
    console.log(response);
  };

  if (session)
    return (
      <div className="w-3/4 mx-auto">
        <div className="pt-12">
          <h1 className="text-4x1">Todo App</h1>
          <button onClick={() => signOut()}>Sign out</button>
        </div>
        <div className="pt-12">
          <input
            type="text"
            value={todoItem}
            className="w-full rounded py-2 px-4 text-gray-900"
            onChange={(e) => setTodoItem(e.target.value)}
            onKeyDown={handleEnter}
          />
        </div>

        <ul className="pt-12">
          {items
            .filter(({ done }) => !done)
            .map(({ id, message }) => (
              <li
                key={id}
                onClick={() => handleDone(id)}
                className={cx(styles.item)}
              >
                {message}
              </li>
            ))}
          {items
            .filter(({ done }) => done)
            .map(({ id, message }) => (
              <div key={id}>
                <li
                  onClick={() => handleDone(id)}
                  className={cx(styles.item, styles.done)}
                >
                  {message}
                </li>
                <button className="absolute bottom-0 right-0 h-16 w-16" onClick={() => removeItem(id)}>Delete</button>
              </div>
            ))}
        </ul>
      </div>
    );
  else {
    return (
      <>
        Not signed in <br />
        <button onClick={() => signIn()}>Sign in</button>
      </>
    );
  }
};

export default Home;
