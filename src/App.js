import { useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import "./App.css";
import { IconBox, PlusIcon, SearchIcon } from "./components/icon";
import { DotsIcon, EditIcon, TrashIcon } from "./components/icon/icons";
import { Input, Search } from "./components/input";
import { Modal } from "./components/modal";
function App() {
  const [newTaskInputValue, setNewTaskInputValue] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [todoItems, setTodoItems] = useState([]);
  const [doneItems, setDoneItems] = useState([]);

  //function to add new tasks to the todo list
  const handleAddNewTask = () => {
    setTodoItems((oldValue) => [...oldValue, newTaskInputValue]);
    setNewTaskInputValue("");
    setShowAddTaskModal(false);
  };

  //function to remove tasks from the list (done or todo)
  const handleRemoveTask = (e, location, index) => {
    e.preventDefault();

    //chack if the task in todo or done list and remove it
    if (location === "todo") {
      setTodoItems((oldValue) => oldValue?.filter((_, i) => i !== index));
      return;
    }

    setDoneItems((oldValue) => oldValue?.filter((_, i) => i !== index));
  };

  //function for handling drag and drop from todo list to done list and the opposit
  const handleDragAndDrop = (result) => {
    if (!result.destination) return; // When dropped outside a droppable area
    const sourceList = result.source.droppableId;
    const destinationList = result.destination.droppableId;

    if (sourceList === destinationList) {
      // When drop in same list: Reordering
      const reorderedItems = sourceList === "todo" ? todoItems : doneItems;
      const [movedItem] = reorderedItems.splice(result.source.index, 1);
      reorderedItems.splice(result.destination.index, 0, movedItem);

      if (sourceList === "todo") {
        setTodoItems([...reorderedItems]);
      } else {
        setDoneItems([...reorderedItems]);
      }
    } else {
      // Moving between lists
      const movedItem =
        sourceList === "todo"
          ? todoItems[result.source.index]
          : doneItems[result.source.index];

      const newTodoItems = [...todoItems];
      const newDoneItems = [...doneItems];

      if (sourceList === "todo") {
        newTodoItems.splice(result.source.index, 1);
        newDoneItems.splice(result.destination.index, 0, movedItem);
      } else {
        newDoneItems.splice(result.source.index, 1);
        newTodoItems.splice(result.destination.index, 0, movedItem);
      }

      setTodoItems(newTodoItems);
      setDoneItems(newDoneItems);
    }
  };

  return (
    <div className="App">
      <div className="toolbar">
        <IconBox icon={<SearchIcon />} />
        <IconBox
          onClick={() => setShowAddTaskModal(true)}
          icon={<PlusIcon />}
        />
      </div>

      <div className="main">
        <DragDropContext onDragEnd={handleDragAndDrop}>
          <div>
            <div className="title">To do</div>

            <div className="item-box">
              <TodoList
                todoItems={todoItems}
                handleRemoveTask={handleRemoveTask}
              />
            </div>
          </div>
          <div>
            <div className="title">Done</div>
            <div className="item-box">
              <DoneList
                doneItems={doneItems}
                handleRemoveTask={handleRemoveTask}
              />
            </div>
          </div>
        </DragDropContext>
      </div>

      <Modal
        onAction={handleAddNewTask}
        onClose={() => setShowAddTaskModal(false)}
        show={showAddTaskModal}
      >
        <Input
          value={newTaskInputValue}
          onChange={(value) => setNewTaskInputValue(value)}
          label={"ADD NEW TASK"}
          placeholder="Write your task here .."
        />
      </Modal>

      <Search show={false} />
    </div>
  );
}

//todo list dropzone
function TodoList({ todoItems, handleRemoveTask = () => {} }) {
  return (
    <Droppable droppableId="todo">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {todoItems?.length === 0 && (
            <span style={{ fontSize: "14px" }}>
              Your to-do list is empty. Time to start adding tasks and getting
              things done!📝🌟
            </span>
          )}
          {todoItems?.map((item, index) => (
            <Draggable
              key={"key" + index}
              draggableId={index.toString()}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <div className="item">
                    <DotsIcon />
                    <div className="text">{item}</div>
                    <div className="item-icon edit-icon">
                      <EditIcon height={18} width={18} />
                    </div>
                    <div
                      className="item-icon delete-icon"
                      onClick={(e) => handleRemoveTask(e, "todo", index)}
                    >
                      <TrashIcon height={18} width={18} />
                    </div>
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Draggable>
          ))}
        </div>
      )}
    </Droppable>
  );
}

//done list dropzone
function DoneList({ doneItems, handleRemoveTask = () => {} }) {
  return (
    <Droppable droppableId="done">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {doneItems?.length === 0 && (
            <span style={{ fontSize: "14px" }}>
              The Done list is empty. Start completing tasks!
            </span>
          )}
          {doneItems?.map((item, index) => (
            <Draggable
              key={"key" + index}
              draggableId={"done" + index.toString()}
              index={index}
            >
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.draggableProps}
                  {...provided.dragHandleProps}
                >
                  <div className="item">
                    <DotsIcon />
                    <div className="text">{item}</div>
                    <div className="item-icon edit-icon">
                      <EditIcon height={18} width={18} />
                    </div>
                    <div
                      className="item-icon delete-icon"
                      onClick={(e) => handleRemoveTask(e, "done", index)}
                    >
                      <TrashIcon height={18} width={18} />
                    </div>
                  </div>
                  {provided.placeholder}
                </div>
              )}
            </Draggable>
          ))}
        </div>
      )}
    </Droppable>
  );
}

export default App;
