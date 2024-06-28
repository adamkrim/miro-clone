import { v } from "convex/values";

import {
  internalMutation,
  internalQuery,
  mutation,
  query,
} from "./_generated/server";

export const get = internalQuery({
  args: {
    orgId: v.string(),
  },
  handler: async (ctx, { orgId }) => {
    const subscription = await ctx.db
      .query("orgSubscriptions")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .unique();

    return subscription;
  },
});

export const getIsSubscribed = query({
  args: {
    orgId: v.optional(v.string()),
  },
  handler: async (ctx, { orgId }) => {
    const identity = await ctx.auth.getUserIdentity();

    if (!identity) {
      throw new Error("Not authenticated");
    }

    if (!orgId) {
      return false;
    }

    const orgSubscription = await ctx.db
      .query("orgSubscriptions")
      .withIndex("by_org", (q) => q.eq("orgId", orgId))
      .unique();

    if (!orgSubscription) {
      return false;
    }

    const isSubscribed =
      orgSubscription.stripeCurrentPeriodEnd &&
      orgSubscription.stripeCurrentPeriodEnd > Date.now();

    return isSubscribed;
  },
});

export const create = internalMutation({
  args: {
    orgId: v.string(),
    stripeCustomerId: v.string(),
    stripeSubscriptionId: v.string(),
    stripePriceId: v.string(),
    stripeCurrentPeriodEnd: v.number(),
  },
  handler: async (
    ctx,
    {
      orgId,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      stripeCurrentPeriodEnd,
    }
  ) => {
    return await ctx.db.insert("orgSubscriptions", {
      orgId,
      stripeCustomerId,
      stripeSubscriptionId,
      stripePriceId,
      stripeCurrentPeriodEnd,
    });
  },
});

export const update = internalMutation({
  args: {
    stripeSubscriptionId: v.string(),
    stripeCurrentPeriodEnd: v.number(),
  },
  handler: async (ctx, { stripeSubscriptionId, stripeCurrentPeriodEnd }) => {
    try {
      const existingSubscription = await ctx.db
        .query("orgSubscriptions")
        .withIndex("by_subscription", (q) =>
          q.eq("stripeSubscriptionId", stripeSubscriptionId)
        )
        .unique();

      if (!existingSubscription) {
        throw new Error("Subscription not found");
      }

      await ctx.db.patch(existingSubscription._id, {
        stripeCurrentPeriodEnd,
      });

      return { success: true };
    } catch (error) {
      console.error(error);
      return { success: false };
    }
  },
});
