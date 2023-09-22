import { useRef, useState } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { useDispatch } from "react-redux";
import { useSelector } from "react-redux";
import "./App.css";
import { IconBox, PlusIcon, SearchIcon } from "./components/icon";
import { DotsIcon, EditIcon, TrashIcon } from "./components/icon/icons";
import { Input, Search } from "./components/input";
import { Modal } from "./components/modal";
import {
  addTodoTask,
  changeDoneTasks,
  changeTodoTasks,
  removeDoneTaskByIndex,
  removeTodoTaskByIndex,
  updateTodoTaskByIndex,
} from "./redux/slices/task.slice";
function App() {
  const todoItems = useSelector((state) => state.taskReducer.todo);
  const doneItems = useSelector((state) => state.taskReducer.done);

  const dispatch = useDispatch();
  const [newTaskInputValue, setNewTaskInputValue] = useState("");
  const [showAddTaskModal, setShowAddTaskModal] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [showSearch, setShowSearch] = useState(false);

  //helps to close the search modal when click outside
  const openSearchRef = useRef(null);

  //function to add new tasks to the todo list
  const handleAddNewTask = () => {
    dispatch(addTodoTask(newTaskInputValue));
    setNewTaskInputValue("");
    setShowAddTaskModal(false);
  };

  //function to remove tasks from the list (done or todo)
  const handleRemoveTask = (e, location, index) => {
    e.preventDefault();

    //chack if the task in todo or done list and remove it
    if (location === "todo") {
      dispatch(removeTodoTaskByIndex(index));
      return;
    }

    dispatch(removeDoneTaskByIndex(index));
  };

  //function to show the modal of update tasks
  const showUpdateTaskModal = (e, taskValue, index) => {
    e.preventDefault();
    setSelectedTask({ value: taskValue, index });
    setNewTaskInputValue(taskValue);
  };

  //function to update any task in todo List
  const handleUpdateTask = () => {
    dispatch(
      updateTodoTaskByIndex({
        value: newTaskInputValue,
        index: selectedTask.index,
      })
    );
    setSelectedTask(null);
    setNewTaskInputValue("");
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
        dispatch(changeTodoTasks([...reorderedItems]));
      } else {
        dispatch(changeDoneTasks([...reorderedItems]));
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

      dispatch(changeTodoTasks(newTodoItems));
      dispatch(changeDoneTasks(newDoneItems));
    }
  };

  //handle search tasks
  const handleSearch = (value) => {
    const result = todoItems.filter((task) => task.includes(value)).slice(0, 5);
    setSearchResults(result);
  };

  return (
    <div className="App">
      <div className="toolbar">
        <span ref={openSearchRef}>
          <IconBox
            ref={openSearchRef}
            onClick={() => setShowSearch(true)}
            icon={<SearchIcon />}
          />
        </span>
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
                handleUpdateTask={showUpdateTaskModal}
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
        onAction={selectedTask ? handleUpdateTask : handleAddNewTask}
        onClose={() => {
          if (showAddTaskModal) setShowAddTaskModal(false);
          if (selectedTask) setSelectedTask(null);
        }}
        show={showAddTaskModal || selectedTask}
        actionButtonText={selectedTask ? "Update" : "Add"}
      >
        <Input
          value={newTaskInputValue}
          onChange={(value) => setNewTaskInputValue(value)}
          label={showAddTaskModal ? "ADD NEW TASK" : selectedTask?.value}
          placeholder="Write your task here .."
        />
      </Modal>

      <Search
        handleSearch={handleSearch}
        results={searchResults}
        show={showSearch}
        onClose={() => {
          setShowSearch(false);
        }}
        openSearchRef={openSearchRef}
        onSelect={(ev, item) => {
          const index = todoItems.indexOf(item);
          showUpdateTaskModal(ev, item, index);
        }}
      />
    </div>
  );
}

//todo list dropzone
function TodoList({
  todoItems,
  handleRemoveTask = () => {},
  handleUpdateTask = () => {},
}) {
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
                    <div
                      className="item-icon edit-icon"
                      onClick={(e) => handleUpdateTask(e, item, index)}
                    >
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
