/* tslint:disable */

export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  NonNegativeInt: number
  DateTime: Date
  TagName: string
}

export type CreateNoteInput = {
  title?: Maybe<Scalars["String"]>
  content?: Maybe<Scalars["String"]>
  tagIds?: Maybe<Array<Scalars["ID"]>>
  color?: Maybe<NoteColor>
}

export type CreateTagInput = {
  name: Scalars["String"]
}

export type Mutation = {
  createNote: Note
  updateNote: Note
  addTag: Note
  removeTag: Note
  deleteNote: Scalars["Boolean"]
  createTag: Tag
  updateTag: Tag
  deleteTag: Scalars["Boolean"]
}

export type MutationCreateNoteArgs = {
  input: CreateNoteInput
}

export type MutationUpdateNoteArgs = {
  id: Scalars["ID"]
  input: UpdateNoteInput
}

export type MutationAddTagArgs = {
  noteId: Scalars["ID"]
  tagId: Scalars["ID"]
}

export type MutationRemoveTagArgs = {
  noteId: Scalars["ID"]
  tagId: Scalars["ID"]
}

export type MutationDeleteNoteArgs = {
  id: Scalars["ID"]
}

export type MutationCreateTagArgs = {
  input: CreateTagInput
}

export type MutationUpdateTagArgs = {
  id: Scalars["ID"]
  input: UpdateTagInput
}

export type MutationDeleteTagArgs = {
  id: Scalars["ID"]
}

export type Node = {
  id: Scalars["ID"]
}

export type Note = Node & {
  id: Scalars["ID"]
  title: Scalars["String"]
  content: Scalars["String"]
  createdAt: Scalars["DateTime"]
  modifiedAt: Scalars["DateTime"]
  tags: Array<Tag>
  color: NoteColor
}

export enum NoteColor {
  White = "WHITE",
  Yellow = "YELLOW",
  Green = "GREEN",
  Red = "RED",
  Blue = "BLUE",
}

export type NoteEdge = {
  cursor: Scalars["String"]
  note: Note
}

export type NotesConnection = {
  totalCount: Scalars["Int"]
  pageInfo: PageInfo
  edges: Array<NoteEdge>
}

export type PageInfo = {
  hasNextPage: Scalars["Boolean"]
  endCursor?: Maybe<Scalars["String"]>
}

export type Query = {
  node: Node
  nodes: Array<Node>
  notes: NotesConnection
  allNotes: Array<Note>
  tags: Array<Tag>
}

export type QueryNodeArgs = {
  id: Scalars["ID"]
}

export type QueryNodesArgs = {
  ids: Array<Scalars["ID"]>
}

export type QueryNotesArgs = {
  first?: Maybe<Scalars["NonNegativeInt"]>
  after?: Maybe<Scalars["String"]>
  sortBy: SortBy
  sortOrder: SortOrder
}

export type QueryAllNotesArgs = {
  sortBy: SortBy
  sortOrder: SortOrder
}

export enum SortBy {
  Title = "title",
  CreatedAt = "createdAt",
  ModifiedAt = "modifiedAt",
}

export enum SortOrder {
  Asc = "ASC",
  Desc = "DESC",
}

export type Tag = Node & {
  id: Scalars["ID"]
  name: Scalars["String"]
  notes: NotesConnection
  allNotes: Array<Note>
}

export type TagNotesArgs = {
  first?: Maybe<Scalars["NonNegativeInt"]>
  after?: Maybe<Scalars["String"]>
  sortBy: SortBy
  sortOrder: SortOrder
}

export type TagAllNotesArgs = {
  sortBy: SortBy
  sortOrder: SortOrder
}

export type UpdateNoteInput = {
  title?: Maybe<Scalars["String"]>
  content?: Maybe<Scalars["String"]>
  color?: Maybe<NoteColor>
}

export type UpdateTagInput = {
  name?: Maybe<Scalars["String"]>
}
export type NotesQueryVariables = {}

export type NotesQuery = { __typename?: "Query" } & {
  allNotes: Array<{ __typename?: "Note" } & Pick<Note, "content">>
}
import { NoteObject, TagObject } from "../server-mock/db"
import { Context } from "../server-mock"
import { DeepPartial } from "ts-essentials"

import {
  GraphQLResolveInfo,
  GraphQLScalarType,
  GraphQLScalarTypeConfig,
} from "graphql"

export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>

export type ResolverFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => Promise<TResult> | TResult

export type StitchingResolver<TResult, TParent, TContext, TArgs> = {
  fragment: string
  resolve: ResolverFn<TResult, TParent, TContext, TArgs>
}

export type Resolver<TResult, TParent = {}, TContext = {}, TArgs = {}> =
  | ResolverFn<TResult, TParent, TContext, TArgs>
  | StitchingResolver<TResult, TParent, TContext, TArgs>

export type SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => AsyncIterator<TResult> | Promise<AsyncIterator<TResult>>

export type SubscriptionResolveFn<TResult, TParent, TContext, TArgs> = (
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

export interface SubscriptionResolverObject<TResult, TParent, TContext, TArgs> {
  subscribe: SubscriptionSubscribeFn<TResult, TParent, TContext, TArgs>
  resolve?: SubscriptionResolveFn<TResult, TParent, TContext, TArgs>
}

export type SubscriptionResolver<
  TResult,
  TParent = {},
  TContext = {},
  TArgs = {}
> =
  | ((
      ...args: any[]
    ) => SubscriptionResolverObject<TResult, TParent, TContext, TArgs>)
  | SubscriptionResolverObject<TResult, TParent, TContext, TArgs>

export type TypeResolveFn<TTypes, TParent = {}, TContext = {}> = (
  parent: TParent,
  context: TContext,
  info: GraphQLResolveInfo,
) => Maybe<TTypes>

export type NextResolverFn<T> = () => Promise<T>

export type DirectiveResolverFn<
  TResult = {},
  TParent = {},
  TContext = {},
  TArgs = {}
> = (
  next: NextResolverFn<TResult>,
  parent: TParent,
  args: TArgs,
  context: TContext,
  info: GraphQLResolveInfo,
) => TResult | Promise<TResult>

/** Mapping between all available schema types and the resolvers types */
export type ResolversTypes = {
  Query: {}
  ID: DeepPartial<Scalars["ID"]>
  Node: DeepPartial<Node>
  NonNegativeInt: DeepPartial<Scalars["NonNegativeInt"]>
  String: DeepPartial<Scalars["String"]>
  SortBy: DeepPartial<SortBy>
  SortOrder: DeepPartial<SortOrder>
  NotesConnection: DeepPartial<NotesConnection>
  Int: DeepPartial<Scalars["Int"]>
  PageInfo: DeepPartial<PageInfo>
  Boolean: DeepPartial<Scalars["Boolean"]>
  NoteEdge: DeepPartial<
    Omit<NoteEdge, "note"> & { note: ResolversTypes["Note"] }
  >
  Note: NoteObject
  DateTime: DeepPartial<Scalars["DateTime"]>
  Tag: TagObject
  NoteColor: DeepPartial<NoteColor>
  Mutation: {}
  CreateNoteInput: DeepPartial<CreateNoteInput>
  UpdateNoteInput: DeepPartial<UpdateNoteInput>
  CreateTagInput: DeepPartial<CreateTagInput>
  UpdateTagInput: DeepPartial<UpdateTagInput>
  TagName: DeepPartial<Scalars["TagName"]>
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime"
}

export type MutationResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Mutation"]
> = {
  createNote?: Resolver<
    ResolversTypes["Note"],
    ParentType,
    ContextType,
    MutationCreateNoteArgs
  >
  updateNote?: Resolver<
    ResolversTypes["Note"],
    ParentType,
    ContextType,
    MutationUpdateNoteArgs
  >
  addTag?: Resolver<
    ResolversTypes["Note"],
    ParentType,
    ContextType,
    MutationAddTagArgs
  >
  removeTag?: Resolver<
    ResolversTypes["Note"],
    ParentType,
    ContextType,
    MutationRemoveTagArgs
  >
  deleteNote?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    MutationDeleteNoteArgs
  >
  createTag?: Resolver<
    ResolversTypes["Tag"],
    ParentType,
    ContextType,
    MutationCreateTagArgs
  >
  updateTag?: Resolver<
    ResolversTypes["Tag"],
    ParentType,
    ContextType,
    MutationUpdateTagArgs
  >
  deleteTag?: Resolver<
    ResolversTypes["Boolean"],
    ParentType,
    ContextType,
    MutationDeleteTagArgs
  >
}

export type NodeResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Node"]
> = {
  __resolveType: TypeResolveFn<"Note" | "Tag", ParentType, ContextType>
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
}

export interface NonNegativeIntScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["NonNegativeInt"], any> {
  name: "NonNegativeInt"
}

export type NoteResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Note"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  title?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  content?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  createdAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>
  modifiedAt?: Resolver<ResolversTypes["DateTime"], ParentType, ContextType>
  tags?: Resolver<Array<ResolversTypes["Tag"]>, ParentType, ContextType>
  color?: Resolver<ResolversTypes["NoteColor"], ParentType, ContextType>
}

export type NoteEdgeResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["NoteEdge"]
> = {
  cursor?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  note?: Resolver<ResolversTypes["Note"], ParentType, ContextType>
}

export type NotesConnectionResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["NotesConnection"]
> = {
  totalCount?: Resolver<ResolversTypes["Int"], ParentType, ContextType>
  pageInfo?: Resolver<ResolversTypes["PageInfo"], ParentType, ContextType>
  edges?: Resolver<Array<ResolversTypes["NoteEdge"]>, ParentType, ContextType>
}

export type PageInfoResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["PageInfo"]
> = {
  hasNextPage?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>
  endCursor?: Resolver<Maybe<ResolversTypes["String"]>, ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Query"]
> = {
  node?: Resolver<
    ResolversTypes["Node"],
    ParentType,
    ContextType,
    QueryNodeArgs
  >
  nodes?: Resolver<
    Array<ResolversTypes["Node"]>,
    ParentType,
    ContextType,
    QueryNodesArgs
  >
  notes?: Resolver<
    ResolversTypes["NotesConnection"],
    ParentType,
    ContextType,
    QueryNotesArgs
  >
  allNotes?: Resolver<
    Array<ResolversTypes["Note"]>,
    ParentType,
    ContextType,
    QueryAllNotesArgs
  >
  tags?: Resolver<Array<ResolversTypes["Tag"]>, ParentType, ContextType>
}

export type TagResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Tag"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  notes?: Resolver<
    ResolversTypes["NotesConnection"],
    ParentType,
    ContextType,
    TagNotesArgs
  >
  allNotes?: Resolver<
    Array<ResolversTypes["Note"]>,
    ParentType,
    ContextType,
    TagAllNotesArgs
  >
}

export interface TagNameScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["TagName"], any> {
  name: "TagName"
}

export type Resolvers<ContextType = Context> = {
  DateTime?: GraphQLScalarType
  Mutation?: MutationResolvers<ContextType>
  Node?: NodeResolvers
  NonNegativeInt?: GraphQLScalarType
  Note?: NoteResolvers<ContextType>
  NoteEdge?: NoteEdgeResolvers<ContextType>
  NotesConnection?: NotesConnectionResolvers<ContextType>
  PageInfo?: PageInfoResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Tag?: TagResolvers<ContextType>
  TagName?: GraphQLScalarType
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>
