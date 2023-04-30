import React, { useEffect, useState } from "react";
import "./App.css";

type Todo = {
  id: number;
  task: string;
};

function App() {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [task, setTask] = useState<string>("");
  const [history, setHistory] = useState<any>([[[], null, null]]);
  const [alert, setAlert] = useState<Boolean>(false);
  const [undoButton, setUndoButton] = useState<Boolean>(false);
  const [redoButton, setRedoButton] = useState<Boolean>(false);

  let data = history[history.length - 1][0];
  let prevData = history[history.length - 1][0];
  let prevUndo = history[history.length - 1][1];
  let prevRedo = history[history.length - 1][2];

  // set task from input value
  const handleInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.value !== " ") {
      setTask(event.target.value);
    }
  };

  // call add function upon entering a task
  const handleFormSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    add();
  };

  // add new task into list
  const add = () => {
    let preState: any = [];

    // create a new todo
    const todo: Todo = {
      id: Date.now(),
      task: task,
    };

    // populate data into preState & todos lists
    if (todos !== undefined) {
      preState = [...todos, todo];
      setTodos(preState);
    } else {
      preState = [todo];
      setTodos([todo]);
    }

    // create new history after input

    // get new index of the todo input
    let newIndex = preState.length - 1;

    // create new history data of the todo to be displayed
    let newHistData = [];
    let newHist = [];

    if (history[history.length - 1][0].length === 0) {
      newHistData = [newIndex];
    } else {
      newHistData = [...history[history.length - 1][0], newIndex];
    }
    // undo and redo index of the new history
    let undo = history.length - 1;
    let redo = null;

    // populate previous history data & current history data
    newHist = [newHistData, undo, redo];
    let hist = [...history, newHist];

    // set history
    setHistory(hist);

    // clear task value
    setTask("");
  };

  // undo last action on list
  const undo = (e: any) => {
    e.preventDefault();

    if (prevUndo !== undefined) {
      let newHistData = history[prevUndo][0];
      let undo = history[prevUndo][1];
      let redo = history.length - 1;
      let newHist = [newHistData, undo, redo];
      let hist = [...history, newHist];

      // set history
      setHistory(hist);
    }
  };

  // redo last action on list
  const redo = (e: any) => {
    e.preventDefault();

    if (prevRedo !== undefined) {
      let newHistData = history[prevRedo][0];
      let undo = history.length - 1;
      let redo = history[prevRedo][2];
      let newHist = [newHistData, undo, redo];
      let hist = [...history, newHist];

      // set history
      setHistory(hist);
    }
  };

  // remove task from list
  const handleDelete = (id: number) => {
    // filter task by id
    let newHistData = prevData.filter((i: number) => i !== id);
    let undo = history.length - 1;
    let redo = null;
    let newHist = [newHistData, undo, redo];
    let hist = [...history, newHist];

    // set history
    setHistory(hist);
  };

  // display alert for clear all tasks from list
  const handleAlert = (e: any) => {
    e.preventDefault();
    setAlert(true);
  };

  // clear all tasks on list
  const handleClearAll = (e: any) => {
    e.preventDefault();
    setTodos([]);
    setHistory([[[], null, null]]);
    setAlert(false);
  };

  useEffect(() => {
    // disable undo button when there are no history actions available
    prevUndo === null ? setUndoButton(false) : setUndoButton(true);
    // disable redo button when there are no history actions available
    prevRedo === null ? setRedoButton(false) : setRedoButton(true);

    // console.log("todos: ", todos, "data: ", data);
  }, [data, prevRedo, prevUndo, todos]);

  return (
    <div className="container">
      <h1 className="title">To Do List</h1>
      <div className="input_container">
        <form onSubmit={handleFormSubmit} autoComplete="off">
          <div className="row">
            <input
              id="input"
              type="text"
              name="task"
              placeholder=" Add task..."
              value={task}
              onChange={handleInput}
            />
          </div>
          <div className="row">
            <button id="add" type="submit" disabled={!task}>
              Add
            </button>
            <button id="undo" disabled={!undoButton} onClick={(e) => undo(e)}>
              Undo
            </button>
            <button id="redo" disabled={!redoButton} onClick={(e) => redo(e)}>
              Redo
            </button>
            <button disabled={data.length < 1} onClick={(e) => handleAlert(e)}>
              Clear All
            </button>
          </div>
        </form>
      </div>
      {data.length < 1 ? (
        <div className="empty_list">
          Your list is empty! Please add a new task.
        </div>
      ) : (
        <div className="list_container">
          {alert ? (
            <div className="alert">
              <span className="close_button" onClick={() => setAlert(false)}>
                &times;
              </span>
              <h3>This action cannot be undone!</h3>
              <p>Proceed to clear all items on list?</p>
              <div className="yes_button">
                <button onClick={(e) => handleClearAll(e)}>Yes</button>
              </div>
            </div>
          ) : (
            <div></div>
          )}
          <ul>
            {todos !== undefined && (
              <>
                {data.map((i: number) => (
                  <div key={todos[i].id}>
                    <div className="row task">
                      <div className="column left">
                        <li>{todos[i].task}</li>
                      </div>
                      <div className="column right">
                        <button
                          className="done_button"
                          onClick={() => handleDelete(i)}
                        >
                          Done
                        </button>
                      </div>
                    </div>
                    <hr className="solid" />
                  </div>
                ))}
              </>
            )}
          </ul>
          <p className="end_list">*end of list*</p>
        </div>
      )}
    </div>
  );
}

export default App;
