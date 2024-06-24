import mongoose from 'mongoose'

type ConnectionObject = { // type for connection object
    isConnected?: number // 0 for disconnected, 1 for connected. Optional as it will be undefined initially
}

 const connection: ConnectionObject = {} // For storing connection object

 async function dbConnect(): Promise<void>{
      if(connection.isConnected){ // If connection object is already defined, then simply return
        console.log("Already connected to database");
        return;
      }
      try {
        const db = await mongoose.connect(process.env.MONGODB_URI || '', {}); // Connect to database
        connection.isConnected = db.connections[0].readyState // Store the connection object

        console.log("DB Connected Successfully");

      } catch (error: any) {
        console.log("Database connection failed", error);
        process.exit(1)
      }
 }

 export default dbConnect;