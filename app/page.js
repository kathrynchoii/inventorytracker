'use client'
import { useState, useEffect } from 'react'
import { firestore } from '@/firebase'
import { Box, Modal, Typography, Stack, TextField, Button } from "@mui/material"
import { collection, getDocs, query, getDoc, deleteDoc, doc, setDoc, writeBatch } from "firebase/firestore"

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [resetFlag, setResetFlag] = useState(false)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({
        name: doc.id,
        ...doc.data(),
      })
    })
    setInventory(inventoryList)
  }

  const addItem = async (item) => {
    const normalizedItem = item.trim().toLowerCase()
    const docRef = doc(collection(firestore, 'inventory'), normalizedItem)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, { quantity: quantity + 1 })
    } else {
      await setDoc(docRef, { quantity: 1 })
    }

    await updateInventory()
  }

  const removeItem = async (item) => {
    const normalizedItem = item.trim().toLowerCase()
    const docRef = doc(collection(firestore, 'inventory'), normalizedItem)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }

    await updateInventory()
  }

  useEffect(() => {
    updateInventory()
  }, [resetFlag])

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)

  const handleReset = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const batch = writeBatch(firestore)
    docs.forEach((doc) => {
      batch.delete(doc.ref)
    })
    await batch.commit()
    setResetFlag(!resetFlag)
  }

  const filteredInventory = inventory.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <Box
      width="100vw"
      height="100vh"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={2}
      sx={{ backgroundColor: "white" }}
    >
      <Box
        border="1px solid #333"
        width="800px"
        height="90px"
        display="flex"
        alignItems="center"
        justifyContent="center"
        borderRadius={4}
        bgcolor="white"
        marginBottom={2}
      >
        <Typography variant='h2' color="#333">
          Inventory Items
        </Typography>
      </Box>

      <Modal open={open} onClose={handleClose}>
        <Box
          position="absolute"
          top="50%"
          left="50%"
          width={400}
          bgcolor="white"
          border="2px solid #000"
          boxShadow={24}
          p={4}
          display="flex"
          flexDirection="column"
          gap={3}
          sx={{
            transform: 'translate(-50%, -50%)',
          }}
        >
          <Typography variant="h6">Add Item</Typography>
          <Stack width="100%" direction="row" spacing={2}>
            <TextField
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => {
                setItemName(e.target.value.trim().toLowerCase())
              }}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>

      <TextField
        bgcolor="white"
        variant="outlined"
        placeholder="Search Items"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        fullWidth
        sx={{ maxWidth: 600, marginBottom: 2 }}
      />

      <Stack direction="row" spacing={2}>
        <Button
          variant="contained"
          onClick={handleOpen}
        >
          Add New Item
        </Button>
        <Button
          variant="contained"
          onClick={handleReset}
        >
          Reset
        </Button>
      </Stack>

      <Box
        border="1px solid #333"
        bgcolor="white"
        borderRadius={4}
        boxShadow={3}
        padding={3}
        maxWidth={800}
        width="100%"
      >
        <Stack width="800px" height="300px" spacing={2} overflow="auto">
          {filteredInventory.map(({ name, quantity }) => (
            <Box
              key={name}
              width="95%"
              minHeight="100px"
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              backgroundColor="white"
              padding={3}
            >
              <Typography variant='h3' color="#333" textAlign="center" sx={{ flexGrow: 1 }}>
                {name.charAt(0).toUpperCase() + name.slice(1)}
              </Typography>
              <Typography variant='h3' color="#333" textAlign="center" sx={{ flexGrow: 2 }}>
                {quantity}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ flexGrow: 0.5 }}>
                <Button
                  variant="contained"
                  onClick={() => addItem(name)}
                >
                  Add
                </Button>
                <Button
                  variant="contained"
                  onClick={() => removeItem(name)}
                >
                  Remove
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}
