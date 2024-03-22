const amqplib = require('amqplib')
const amqp_url_cloud = 'amqps://bobadfbe:mwAOAPi0JIr9RhMukVvJ5RBMY-OqcoTm@armadillo.rmq.cloudamqp.com/bobadfbe'
const amqp_url_docker = 'amqp://localhost:5672'
const sendQueue = async ({msg}) => {
    try {
        const conn = await amqplib.connect(amqp_url_docker)
        const channel = await conn.createChannel()
        const nameQueue = 'q2'
        await channel.assertQueue(nameQueue,{
            durable: true //=true thi khi restart lai ko bi mat message (luu y khi set true thi set luon cho consumer)
        })
        await channel.sendToQueue(nameQueue,Buffer.from(msg),{
            //expiration: '10000', //set TTL(thoi gian message ton tai)
            persistent: true //luu tru lien tuc neu cache loi thi luu vao o dia
        })
    } catch (error) {
        console.error('Error::',error.message)
    }
}
const msg = process.argv.slice(2).join(' ') || 'Hello'
sendQueue({msg})