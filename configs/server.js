'use strict'

import express from 'express'
import cors from 'cors'
import helmet from 'helmet'
import morgan from 'morgan'
import { dbConnection } from './mongo.js';
import userRoutes from '../src/users/user.routes.js';
import authRoutes from '../src/auth/auth.routes.js';
import categoryRoutes from '../src/categories/category.routes.js';
import productRoutes from '../src/products/products.routes.js';
import cartRoutes from '../src/trolley/trolley.routes.js'


class Server{
    constructor(){
        this.app = express();
        this.port = process.env.PORT;
        this.usersPath = '/systemOnlineStore/v1/user';
        this.authPath = '/systemOnlineStore/v1/auth';
        this.categoryPath = '/systemOnlineStore/v1/category';
        this.productPath = '/systemOnlineStore/v1/product';
        this.cartPath = '/systemOnlineStore/v1/cart';
        this.middlewares();
        this.conectarDB();
        this.routes();
        
    }

    async conectarDB(){
        await dbConnection();
    }

    middlewares(){
        this.app.use(express.urlencoded({extended: false}));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(helmet());
        this.app.use(morgan('dev'));
    }

    routes(){
        this.app.use(this.usersPath, userRoutes);
        this.app.use(this.authPath, authRoutes);
        this.app.use(this.categoryPath, categoryRoutes);
        this.app.use(this.productPath, productRoutes);
        this.app.use(this.cartPath, cartRoutes);
    }

    listen(){
        this.app.listen(this.port, () => {
            console.log('Server running on port ', this.port);
        });
    }
}

export default Server;