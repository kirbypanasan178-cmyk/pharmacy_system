import { Order } from "../models/orderModel"

export const getTop3CategoriesService = async () => {
    try {
        const result = await Order.aggregate([

            // filter the order collection, only the paid payment status will pass
            {
                $match: {
                    paymentStatus: "paid"
                },
            },

            // tranform the items array into object to access items.product
            {
                $unwind: "$items"  
            },

            // look to the categories collection
            {
                $lookup: {
                    from: "products", // the collection you want to lookup
                    localField: "items.product", // current collection
                    foreignField: "_id", 
                    as: "product"
                }
            },

            {
                $unwind: "$product"
            },

            {
                $lookup: {
                    from: "categories",
                    localField: "product.category",
                    foreignField: "_id",
                    as: "category"
                }
            },

            {
                $unwind: "$category"
            },


            // combine documents with the same value and calculate things
            {
                $group: {
                    _id: "$category.name",
                    totalSold: { $sum: "$items.quantity" }
                },
            },

            // sort to descending order (-1)
            {
                $sort: {
                    totalSold: -1,
                }
            },

            // top 3 items only 
            {
                $limit: 3
            },

            // final output
            {
                $project: {
                    _id: 0,
                    category: "$_id",
                    totalSold: 1,
                },
            },
        ])

        return result

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to get top 3 categories")
    }
}

export const getOrderSummaryThisWeekService = async () => {
    try {
        const startOfWeek = new Date()

    // move to Monday
    const day = startOfWeek.getDay()
    const diff = startOfWeek.getDate() - (day === 0 ? 6 : day - 1)

    startOfWeek.setDate(diff)
    startOfWeek.setHours(0, 0, 0, 0)

    const endOfWeek = new Date(startOfWeek)
    endOfWeek.setDate(startOfWeek.getDate() + 6)
    endOfWeek.setHours(23, 59, 59, 999)

    const orders = await Order.find({
        createdAt: { $gte: startOfWeek, $lte: endOfWeek }
    })

    const values = [0, 0, 0, 0, 0, 0, 0]

    orders.forEach((order) => {
        const orderDate = new Date(order.createdAt)

        let dayIndex = orderDate.getDay()

        dayIndex = dayIndex === 0 ? 6 : dayIndex - 1

        values[dayIndex]++
    })

    return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values
    }
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to get order summary this year")
    }
}

export const getTop10ProductsService = async () => {
    try {
        const result = await Order.aggregate([
        {
            $match: {
                paymentStatus: "paid"
            },
        },

        { 
            $unwind: "$items" 
        },

        {
            $group: {
                _id: "$items.product",
                totalSold: { $sum: "$items.quantity"},
                revenue: {
                    $sum: {
                        $multiply: ["$items.quantity", "$items.price"],
                    }
                },
            },
        },

        { 
            $sort: { totalSold: -1 } 
        },

        { 
            $limit: 10 
        },

        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "product",
            },
        },

        {
            $unwind: "$product",
        },

        {
            $project: {
                _id: 0,
                name: "$product.name",
                price: "$product.price",
                totalSold: 1,
                revenue: 1,
            }
        },

    ])

    return result
    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to get top products" )
    }
}

export const getWeeklyRevenueService = async () => {
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6)
    sevenDaysAgo.setHours(0, 0, 0, 0);


    const result = await Order.aggregate([
        {
            $match: {
                paidAt: { $gte: sevenDaysAgo },
                paymentStatus: "paid"
            }
        },
        {
            $group: {
                _id: {
                    $dateToString: {
                        format: "%Y-%m-%d",
                        date: "$paidAt",
                    }
                },
                revenue: {
                    $sum: "$totalPrice"
                }
            },
        },
        {
            $sort: {
                _id: 1
            }
        }
    ])

    const dayMap = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]

    const formatted = result.map(item => {
        const date = new Date(item._id)
        return {
            day: dayMap[date.getDay()],
            revenue: item.revenue ?? 0
        }
    })

    const fullWeek = Array.from({ length: 7 }, (_, i) => {
        const date = new Date() // june 16
        date.setDate(date.getDate() - (6 - i)) // (16 - (6 - 0)) = 10
        return dayMap[date.getDay()] // return "wed"
    })

    const filledResult = fullWeek.map((day) => {
        const found = formatted.find((r) => r.day === day)
        return {
            day,
            revenue: found ? found.revenue : 0
        }
    })

    return filledResult

}

export const getRevenueThisYearService = async () => {
    try {
        const currentYear = new Date().getFullYear();

        const startOfYear = new Date(currentYear, 0, 1, 0, 0, 0, 0);
        const endOfYear = new Date();

        const result = await Order.aggregate([
            {
                $match: {
                    paidAt: { $gte: startOfYear, $lte: endOfYear },
                    paymentStatus: "paid" // change to paymentStatus if your schema uses it
                }
            },
            {
                $group: {
                    _id: { $month: "$paidAt" },
                    revenue: { $sum: "$totalPrice" }
                }
            },
            {
                $sort: { _id: 1 }
            },
            {
                $project: {
                    _id: 0,
                    month: {
                        $arrayElemAt: [
                            [
                                "",
                                "Jan", "Feb", "Mar", "Apr",
                                "May", "Jun", "Jul", "Aug",
                                "Sep", "Oct", "Nov", "Dec"
                            ],
                            "$_id"
                        ]
                    },
                    revenue: 1
                }
            }
        ]);

        // Fill missing months (important for charts)
        const fullMonths = [
            "Jan", "Feb", "Mar", "Apr",
            "May", "Jun", "Jul", "Aug",
            "Sep", "Oct", "Nov", "Dec"
        ];

        const filledResult = fullMonths.map((month) => {
            const found = result.find((r) => r.month === month);
            return {
                month,
                revenue: found ? found.revenue : 0
            };
        });

        return filledResult;

    } catch (error) {
        throw new Error(
            error instanceof Error
                ? error.message
                : "Failed to get revenue this year"
        );
    }
};

export const getOrderStatusDistributionService = async () => {
    try {
        const result = await Order.aggregate([
            {
                $group: {
                    _id: "$status",
                    count: { $sum: 1 }
                }
            }
        ])

        const statusMap = new Map(result.map(r => [r._id, r.count]))

        const statuses = ["pending", "processing", "shipped", "delivered", "cancelled"]

        return statuses.map(status => ({
            status,
            count: statusMap.get(status) ?? 0
        }))

    } catch (error) {
        throw new Error(error instanceof Error ? error.message : "Failed to get order status distribution")
    }
}