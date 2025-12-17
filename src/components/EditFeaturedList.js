import React, { useState, useEffect } from "react";
import { db, auth } from "../firebase";
import {
  collection,
  updateDoc,
  doc,
  query,
  where,
  limit,
  getDocs,
} from "firebase/firestore";
import { getListData } from "../functions/ListFunctions";
import ListPreview from "./ListPreview";
import "../styles/EditFeaturedList.css";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import TextField from "@mui/material/TextField";
import { styled } from "@mui/material/styles";

const CustomTextField = styled(TextField)({
  "& label.Mui-focused": {
    color: "var(--rating-color)",
  },
  "& .MuiOutlinedInput-root": {
    "&.Mui-focused fieldset": {
      borderColor: "var(--rating-color)",
    },
  },
});

export default function EditFeaturedList({ setFeaturedList }) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredLists, setFilteredLists] = useState([]);

  const handleSearchChange = async (e) => {
    setSearchQuery(e.target.value);
  };

  useEffect(() => {
    const filterLists = async () => {
      if (searchQuery !== "") {
        const listsCollection = collection(db, "lists");
        const q = query(
          listsCollection,
          where("owner", "==", auth.currentUser.uid),
          where("name", ">=", searchQuery),
          where("name", "<=", searchQuery + "\uf8ff"),
          limit(10)
        );

        const listResults = [];
        const querySnapshot = await getDocs(q);
        querySnapshot.forEach((doc) => {
          const listData = doc.data();
          const listResult = {
            ...listData,
            id: doc.id,
          };
          listResults.push(listResult);
        });
        setFilteredLists(listResults);
      } else {
        setFilteredLists([]);
      }
    };
    filterLists();
  }, [searchQuery]);

  const handleSelectList = async (listId) => {
    const featuredList = await getListData(listId);
    setFeaturedList(featuredList);
    const docRef = doc(db, "profileData", auth.currentUser.uid);
    try {
      await updateDoc(docRef, {
        featuredList: featuredList,
      });
      handleClose();
    } catch (error) {
      console.error("Error updating featured list:", error);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setSearchQuery("");
    setFilteredLists([]);
  };

  return (
    <>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        className="w-6 h-6 edit-icon"
        onClick={() => setOpen(true)}
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
        />
      </svg>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          style: {
            backgroundColor: "var(--wrapper)",
            color: "var(--text-color)",
            borderRadius: "16px",
            padding: "10px",
          },
        }}
      >
        <DialogTitle className="dialog-title">Edit Featured List</DialogTitle>
        <DialogContent>
          <CustomTextField
            type="text"
            label="Search your lists"
            value={searchQuery}
            onChange={handleSearchChange}
            fullWidth
            margin="normal"
            InputLabelProps={{
              style: { color: "var(--text-color)" },
            }}
            InputProps={{
              style: {
                color: "var(--text-color)",
                backgroundColor: "var(--background)",
              },
            }}
          />
          {filteredLists.length > 0 && (
            <ul className="list-results">
              {filteredLists.map((list) => (
                <li key={list.id} className="list-result-item">
                  <ListPreview list={list} />
                  <Button
                    variant="contained"
                    onClick={() => handleSelectList(list.id)}
                    style={{
                      background: "var(--accent-gradient)",
                      color: "white",
                      marginTop: "8px",
                    }}
                  >
                    Select List
                  </Button>
                </li>
              ))}
            </ul>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleClose}
            style={{
              backgroundColor: "var(--rating-color)",
              color: "white",
              borderRadius: "10px",
            }}
          >
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
