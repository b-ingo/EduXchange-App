import { StyleSheet, Text, View } from 'react-native'
import { useState, useEffect } from 'react'
import { auth, db } from '../firebase';
import { doc, getDoc, collection, query, where, getDocs, or } from "firebase/firestore";
import React from 'react'
import { DataTable } from 'react-native-paper';

const PointHistoryScreen = () => {
  const [pointHistory, setPointHistory] = useState([])
  const [page, setPage] = useState(0)
  const [numberOfItemsPerPageList] = useState([20, 50, 100]);
  const [itemsPerPage, onItemsPerPageChange] = useState(
    numberOfItemsPerPageList[0]
  );

  const from = page * itemsPerPage;
  const to = Math.min((page + 1) * itemsPerPage, pointHistory.length);

  useEffect(() => {
    setPage(0);
  }, [itemsPerPage]);

  const userID = auth.currentUser.uid;
  console.log()

  useEffect(() => {
    // Fetch data from Firebase Firestore
    const fetchUserData = async () => {
      const userRef = doc(db, 'users', userID); // Create a reference to the user document
      const pointHistoryQuery = collection(userRef, 'pointHistory'); // Create a reference to the "pointHistory" subcollection         
      const querySnapshot = await getDocs(pointHistoryQuery);

      const docsData = querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      console.log(docsData)
      setPointHistory([...docsData])
    };

    fetchUserData();

  }, []);

  useEffect(() => {
    console.log("PointHistory::::::", pointHistory)
  }, [pointHistory])

  return (
    <View>
      <DataTable>
      <DataTable.Header>
        <DataTable.Title>Points</DataTable.Title>
        <DataTable.Title>Type</DataTable.Title>
        <DataTable.Title>Material</DataTable.Title>
        <DataTable.Title>Date</DataTable.Title>
        
      </DataTable.Header>

      {pointHistory.slice(from, to).map((item) => (
        <DataTable.Row key={item.id}>
          <DataTable.Cell>{item.points}</DataTable.Cell>
          <DataTable.Cell>{item.type}</DataTable.Cell>
          <DataTable.Cell>{item.materialTitle}</DataTable.Cell>
          <DataTable.Cell>{item.date.toDate().toDateString()}</DataTable.Cell>
        </DataTable.Row>
      ))}

      <DataTable.Pagination
        page={page}
        numberOfPages={Math.ceil(pointHistory.length / itemsPerPage)}
        onPageChange={(page) => setPage(page)}
        label={`${from + 1}-${to} of ${pointHistory.length}`}
        numberOfItemsPerPageList={numberOfItemsPerPageList}
        numberOfItemsPerPage={itemsPerPage}
        onItemsPerPageChange={onItemsPerPageChange}
        showFastPaginationControls
        selectPageDropdownLabel={'Rows per page'}
      />
    </DataTable>
    </View>
  )
}

export default PointHistoryScreen

const styles = StyleSheet.create({})