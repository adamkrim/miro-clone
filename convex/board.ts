import { v } from "convex/values";

import { mutation, query } from "./_generated/server";

const ORG_BOARD_LIMIT = 2;

const images = [
  "/placeholders/1.svg",
  "/placeholders/2.svg",
  "/placeholders/3.svg",
  "/placeholders/4.svg",
  "/placeholders/5.svg",
];

export const create = mutation({
  args: {
    orgId: v.string(),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const randomImage = images[Math.floor(Math.random() * images.length)];

    const orgSubscription = await ctx.db
      .query("orgSubscriptions")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .unique();

    const periodEnd = orgSubscription?.stripeCurrentPeriodEnd;
    const isSubscribed = periodEnd && periodEnd > Date.now();

    const existingBoards = await ctx.db
      .query("boards")
      .withIndex("by_org", (q) => q.eq("orgId", args.orgId))
      .collect();

    if (!isSubscribed && existingBoards.length >= ORG_BOARD_LIMIT) {
      throw new Error("Organization board limit reached");
    }

    const board = await ctx.db.insert("boards", {
      orgId: args.orgId,
      title: args.title,
      authorId: identity.subject,
      authorName: identity.name!,
      imageUrl: randomImage,
    });

    return board;
  },
});

export const remove = mutation({
  args: {
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const userId = identity.subject;

    const board = await ctx.db.get(args.boardId);

    if (!board) {
      throw new Error("Board not found");
    }

    const existingFavorites = await ctx.db
      .query("userFavorites")
      .withIndex("by_board", (q) => q.eq("boardId", args.boardId))
      .collect();

    if (existingFavorites.length > 0) {
      const deleteFavorites = existingFavorites.map((favorite) => {
        return ctx.db.delete(favorite._id);
      });
      await Promise.all(deleteFavorites);
    }

    const deletedBoard = await ctx.db.delete(args.boardId);

    return deletedBoard;
  },
});

export const update = mutation({
  args: {
    id: v.id("boards"),
    title: v.string(),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const title = args.title.trim();

    if (!title) {
      throw new Error("Title is required");
    }

    if (title.length > 60) {
      throw new Error("Title cannot be longer than 60 characters");
    }

    const board = await ctx.db.patch(args.id, {
      title: args.title,
    });

    return board;
  },
});

export const favorite = mutation({
  args: {
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const board = await ctx.db.get(args.boardId);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", args.boardId)
      )
      .unique();

    if (existingFavorite) {
      throw new Error("Board already favorited");
    }

    await ctx.db.insert("userFavorites", {
      orgId: board.orgId,
      userId,
      boardId: args.boardId,
    });

    return board;
  },
});

export const unfavorite = mutation({
  args: {
    boardId: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    const board = await ctx.db.get(args.boardId);

    if (!board) {
      throw new Error("Board not found");
    }

    const userId = identity.subject;

    const existingFavorite = await ctx.db
      .query("userFavorites")
      .withIndex("by_user_board", (q) =>
        q.eq("userId", userId).eq("boardId", args.boardId)
      )
      .unique();

    if (!existingFavorite) {
      throw new Error("Favorited board not found");
    }

    await ctx.db.delete(existingFavorite._id);

    return board;
  },
});

export const get = query({
  args: {
    id: v.id("boards"),
  },
  handler: async (ctx, args) => {
    const board = await ctx.db.get(args.id);

    return board;
  },
});
