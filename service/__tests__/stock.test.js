const Product = require("../../models/Product");
const stockService = require('../../service/product/stock.service');
// Mock du modele Product
jest.mock("../../models/Product",()=>({
    updateMany : jest.fn(),
}))
// Mock de session pour ensemble des tests
const session = null;
// Mock de products
let mockProducts;
beforeEach(()=> {  
    mockProducts = [
        {
            name:"Doonut",
            price:2.5,
            stock:20,
            save:jest.fn(),
        },
        {
            name:"Pizza",
            price:3.5,
            stock:0,
            save:jest.fn(),
            
        },
        {
            name:"Tourton",
            price:4.5,
            stock:-5,
            save:jest.fn(),
        }
    ];
})
describe("Test du service decrement stock",()=>{
    
    it("Should decrement mockProduct1.stock",async ()=>{
        
        const result = await stockService.decrementStock(mockProducts[0],session);

        expect(mockProducts[0].stock).toBe(19);
        await expect(mockProducts[0].save).toHaveBeenCalledTimes(1);
        await expect(mockProducts[0].save).toHaveBeenCalledWith(null);
        expect(result).toEqual({
                name:"Doonut",
                price:2.5,
                stock:19,
                save:expect.any(Function),
            },
        )

    })
    it("should throw error because empty product on entry",async ()=>{
        // await decrementStock(null,mockSession);
        expect(stockService.decrementStock(null,session)).rejects.toThrow("No product found, please check your entries");
    })
    it("should throw error because invalid product (no stock key)",async ()=>{
        // await decrementStock(null,mockSession);
        const invalidProduct = {
            name:"Doonut",
            price:2.5,

        }
        expect(stockService.decrementStock(invalidProduct,session)).rejects.toThrow("Il n'y a plus de produit en stock");
    })
    it ("should throw no stockError",()=>{
        expect(stockService.decrementStock(mockProducts[1],session)).rejects.toThrow("Il n'y a plus de produit en stock");
    })
    it ("should throw no stockError if product.stock is negative",()=>{
        expect(stockService.decrementStock(mockProducts[2],session)).rejects.toThrow("Il n'y a plus de produit en stock");
    })

})
describe("Test du service decrement stock avec session fictive",()=>{
    const mockSession = {inTransaction : jest.fn()}
    it("Should decrement mockProduct1.stock",async ()=>{
        
        const result = await stockService.decrementStock(mockProducts[0],mockSession);

        expect(mockProducts[0].stock).toBe(19);
        await expect(mockProducts[0].save).toHaveBeenCalledTimes(1);
        await expect(mockProducts[0].save).toHaveBeenCalledWith({session : mockSession});
        expect(result).toEqual({
                name:"Doonut",
                price:2.5,
                stock:19,
                save:expect.any(Function),
            },
        )

    })

})

describe("Test de updateAllStocks",()=>{
    // Mock de products
   
    afterEach(()=>{
        jest.clearAllMocks();
    })
    // const session = {type : "Transaction Session content"};
    it("Should return success and upgrade all stocks to 20",async ()=>{
        // Implementation de model product
        Product.updateMany.mockImplementation((filter,update,options)=>{
            mockProducts.forEach(product => {
                product.stock = update.stock;
            })
    
            return Promise.resolve({status : "success" , message : "All products were updated"})
    
        })
        const result = await stockService.updateAllStocks(20,session);
        expect(mockProducts).toEqual(
            [
                {
                    name:"Doonut",
                    price:2.5,
                    stock:20,
                    save:expect.any(Function),
                },
                {
                    name:"Pizza",
                    price:3.5,
                    stock:20,
                    save:expect.any(Function),
                },
                {
                    name:"Tourton",
                    price:4.5,
                    stock:20,
                    save:expect.any(Function),
                }
            ]
        )
        expect(result).toEqual({status : "success" , message : "All products were updated"});
        expect(Product.updateMany).toHaveBeenCalledWith({},
            {stock:20},
            null,)

    })

})
describe("Test de updateAllStocks with real session",()=>{
    it("Should return success and upgrade all stocks to 20",async ()=>{
        const mockSession = {inTransaction : jest.fn()};
        // Implementation de model product
        Product.updateMany.mockImplementation((filter,update,options)=>{
            mockProducts.forEach(product => {
                product.stock = update.stock;
            })
    
            return Promise.resolve({status : "success" , message : "All products were updated"})
            
        })
        const result = await stockService.updateAllStocks(20,mockSession);
        expect(Product.updateMany).toHaveBeenCalledWith({},
            {stock:20},
            {session:mockSession},
        )

    })
})

