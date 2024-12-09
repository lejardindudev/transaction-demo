//## Instanciations
const orderService = require('../order/order.service');
const Order = require ("../../models/Order");

//## Mocks de fonctions et de données
// Mock du modele Order
jest.mock("../../models/Order",()=>({
    create:jest.fn(),
}))
// Mock de session
const mockSession = null
// Mock Database
let mockOrdersDatabase;
// Mock produits (pour tests)
const mockProducts = [
    {
        name: 'Laptop',
        price: 1500,
        stock: 30,
    },
    undefined,
    {
        name: 'Laptop',
        stock: 30,
    },
];
// mockProducts[0] --> valide
// mockProducts[1] --> non defini
// mockProducts[2] --> invalide (pas de champs price)


const mockUsers = [
    {
        _id:"80b",
        name:"Bobby",
        email:"bubu@bobo.com",
        balance:1400,
    },
    undefined,
    {
        name:"Bobby",
        email:"bubu@bobo.com",
        balance:1400,
    },
];
// mockUsers[0] --> valide
// mockUsers[1] --> non defini
// mockUsers[2] --> invalide (pas de champs id)
describe("test du service orderService",()=>{
    beforeEach(()=>{
        mockOrdersDatabase = [];
        // jest.resetAllMocks();
    })

    Order.create.mockImplementation((order,options)=>{
        mockOrdersDatabase.push(order);
    })

    it("should create a valid order",async ()=>{
        // Tester modification BDD
        // console.log(mockProducts[0]);
        await orderService.createOrder(mockProducts[0],[mockUsers[0]],mockSession)
        expect(Order.create).toHaveBeenCalledWith(
            [
                {
                    orderNumber : "Order-80b",
                    amount: 1500,
                    userId:"80b",
                },
            ],
            null
        )
        expect(mockOrdersDatabase).toEqual([[
            {
                orderNumber : "Order-80b",
                amount: 1500,
                userId:"80b",
            }
        ]]
        )
    })
    it("should throw error because missing entry product",async ()=>{
        const result = await orderService.createOrder(mockProducts[1],[mockUsers[0]],mockSession)
        expect(result).toBe("Unable to create order without product")
        expect(mockOrdersDatabase).toEqual([]);
    })
    it("should throw error because missing entry user",async ()=>{
        const result = await orderService.createOrder(mockProducts[0],[mockUsers[1]],mockSession);
        expect(result).toBe("Unable to create order without user")
        expect(mockOrdersDatabase).toEqual([]);
    })
    it("should throw error because invalid entry in user id",async ()=>{
        const result = await orderService.createOrder(mockProducts[0],[mockUsers[2]],mockSession);
        expect(result).toBe("invalid entries with user id")
        expect(mockOrdersDatabase).toEqual([]);
    })
    it("should throw error because invalid entry in product price",async ()=>{
        const result = await orderService.createOrder(mockProducts[2],[mockUsers[0]],mockSession);
        expect(result).toBe("invalid entries with product price");
        expect(mockOrdersDatabase).toEqual([]);
    })
    it("should throw a database error",async()=>{
        Order.create.mockRejectedValue("Database Error")
        const result = await orderService.createOrder(mockProducts[0],[mockUsers[0]],mockSession);
    })
})


