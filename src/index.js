const { ApolloServer } = require("apollo-server");
const { PrismaClient } = require("@prisma/client");
const fs = require("fs");
const path = require("path");

const prisma = new PrismaClient();
const resolvers = {
  Query: {
    info: () => "This is the API of a Hackernews CLone",
    feed: async (root, args, ctx) => {
      return await ctx.prisma.link.findMany();
    },
  },
  Mutation: {
    post: async (root, args, ctx) => {
      const link = await ctx.prisma.link.create({
        data: {
          description: args.description,
          url: args.url,
        },
      });
      return link;
    },
    updateLink: async (root, args, ctx) => {
      const { url, description, id } = args;
      return await ctx.prisma.link.update({
        where: {id: parseInt(id)},
        data: {
        url,
        description
        }
      })
    },
    deleteLink: (root, args) => {},
  },
};

const server = new ApolloServer({
  typeDefs: fs.readFileSync(path.join(__dirname, "schema.graphql"), "utf8"),
  resolvers,
  context: {
    prisma
    },
});

server.listen().then(({ url }) => console.log(`Server running on ${url}`));
