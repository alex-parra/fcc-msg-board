import mongoose from 'mongoose';

import Board from './board';
import Thread from './thread';
import Reply from './reply';

const connectDb = () => mongoose.connect(process.env.DB);

const models = { 
  Board,
  Thread, 
  Reply 
};

export { connectDb };
export default models;