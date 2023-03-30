import { useState, useCallback, useEffect } from "react";
import "./App.css";

function App() {
  const [todos, setTodos] = useState<string[]>(() => {
    const storedTodos = localStorage.getItem("todos"); // 初期化時にlocalStorageを確認して、値があればそれを初期値として設定する
    if (storedTodos) {
      return JSON.parse(storedTodos);
    } else {
      return [];
    }
  });
  const [inputValue, setInputValue] = useState<string>("");

  /**
   * useCallback(setup, dependencies)
   * dependenciesに変更があったときに実行される関数を作成する
   * 関数をメモ化させることが出来る。依存配列に指定された依存関係が変更された場合にのみ、関数が再作成される。
   * 例えば親コンポーネントで定義したuseCallbackを子コンポーネントに渡した際、依存関係が変更されない限り、子コンポーネントに渡される関数は同じインスタンスが保持される。
   * 子コンポーネントが不要な再レンダリングがなくなり、パフォーマンスが向上する。
   *
   * setup: 実行する関数
   * dependencies: setupを実行する条件。配列に入れた値が変わったときにuseCallbackが実行される。[]の場合、マウントされたときのみに実行される
   */
  const addTodo = useCallback(() => {
    const trimed = inputValue.trim();
    if (trimed.length > 0) {
      // prev は 今までの todos の配列
      setTodos((prev) => [...prev, trimed]);
      setInputValue("");
    }
  }, [inputValue]);

  const removeTodo = useCallback((index: number) => {
    setTodos((prev) => {
      return prev.filter((_, i) => i !== index);
    });
  }, []);

  /**
   * useEffect(setup, dependencies)
   * コンポーネントがマウント、アンマウント、更新されたときに実行される
   * DOMの操作や外部サービスとの連携に使用される
   * setup: 実行する関数
   * dependencies: setupを実行する条件。[]の場合,マウントされたときのみ実行される
   */
  useEffect(() => {
    // const storedTodos = localStorage.getItem("todos");
    // if (storedTodos) {
    //   setTodos(JSON.parse(storedTodos));
    // }
    // クリーンアップ関数: dependenciesに変更があったり、コンポーネントがマウント、アンマウントされたときに実行される
    return () => {
      console.log("unmount");
    };
  }, []);

  useEffect(() => {
    localStorage.setItem("todos", JSON.stringify(todos));
  }, [todos]);

  return (
    <div>
      <input
        type="text"
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => {
          // キーボードのイベントを取得して、Enterキーが押されたときにaddTodoを実行する
          if (e.key === "Enter") {
            addTodo();
          }
        }}
      />
      <button onClick={addTodo}>Add</button>
      <ul>
        {todos.map((todo, index) => (
          <li key={index}>
            {todo}
            <button onClick={() => removeTodo(index)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
