/* tslint:disable */

export type Maybe<T> = T | null
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string
  String: string
  Boolean: boolean
  Int: number
  Float: number
  DateTime: string | Date
  NonNegativeInt: number
  TagName: string
}

export type ChangeTagsPayload = {
  note: Note
  tag: Tag
  optimistic: Scalars["Boolean"]
}

export type CreateNoteInput = {
  id?: Maybe<Scalars["ID"]>
  title?: Maybe<Scalars["String"]>
  content?: Maybe<Scalars["String"]>
  tagIds?: Maybe<Array<Scalars["ID"]>>
}

export type CreateTagInput = {
  id?: Maybe<Scalars["ID"]>
  name: Scalars["String"]
}

export type DeleteNotePayload = {
  id: Scalars["ID"]
  tags: Array<Tag>
  optimistic: Scalars["Boolean"]
}

export type Mutation = {
  createNote: NotePayload
  updateNote: NotePayload
  addTag: ChangeTagsPayload
  removeTag: ChangeTagsPayload
  deleteNote: DeleteNotePayload
  createTag: TagPayload
  updateTag: TagPayload
  deleteTag: TagPayload
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
}

export type NotePayload = {
  note: Note
  optimistic: Scalars["Boolean"]
}

export type Query = {
  notes: Array<Note>
  tags: Array<Tag>
}

export type Tag = Node & {
  id: Scalars["ID"]
  name: Scalars["String"]
  noteCount: Scalars["NonNegativeInt"]
}

export type TagPayload = {
  tag: Tag
  notes?: Maybe<Array<Note>>
  optimistic: Scalars["Boolean"]
}

export type UpdateNoteInput = {
  title?: Maybe<Scalars["String"]>
  content?: Maybe<Scalars["String"]>
}

export type UpdateTagInput = {
  name?: Maybe<Scalars["String"]>
}
export type NoteFieldsFragment = { __typename?: "Note" } & Pick<
  Note,
  "id" | "title" | "content" | "createdAt" | "modifiedAt"
> & {
    tags: Array<{ __typename?: "Tag" } & Pick<Tag, "id" | "name" | "noteCount">>
  }

export type TagFieldsFragment = { __typename?: "Tag" } & Pick<
  Tag,
  "id" | "name" | "noteCount"
>

export type CreateNoteMutationVariables = {
  id?: Maybe<Scalars["ID"]>
  tagIds?: Maybe<Array<Scalars["ID"]>>
}

export type CreateNoteMutation = { __typename?: "Mutation" } & {
  createNote: { __typename?: "NotePayload" } & Pick<
    NotePayload,
    "optimistic"
  > & { note: { __typename?: "Note" } & NoteFieldsFragment }
}

export type UpdateNoteMutationVariables = {
  id: Scalars["ID"]
  title?: Maybe<Scalars["String"]>
  content?: Maybe<Scalars["String"]>
}

export type UpdateNoteMutation = { __typename?: "Mutation" } & {
  updateNote: { __typename?: "NotePayload" } & Pick<
    NotePayload,
    "optimistic"
  > & { note: { __typename?: "Note" } & NoteFieldsFragment }
}

export type AddTagMutationVariables = {
  noteId: Scalars["ID"]
  tagId: Scalars["ID"]
}

export type AddTagMutation = { __typename?: "Mutation" } & {
  addTag: { __typename?: "ChangeTagsPayload" } & Pick<
    ChangeTagsPayload,
    "optimistic"
  > & {
      note: { __typename?: "Note" } & NoteFieldsFragment
      tag: { __typename?: "Tag" } & TagFieldsFragment
    }
}

export type RemoveTagMutationVariables = {
  noteId: Scalars["ID"]
  tagId: Scalars["ID"]
}

export type RemoveTagMutation = { __typename?: "Mutation" } & {
  removeTag: { __typename?: "ChangeTagsPayload" } & Pick<
    ChangeTagsPayload,
    "optimistic"
  > & {
      note: { __typename?: "Note" } & NoteFieldsFragment
      tag: { __typename?: "Tag" } & TagFieldsFragment
    }
}

export type DeleteNoteMutationVariables = {
  id: Scalars["ID"]
}

export type DeleteNoteMutation = { __typename?: "Mutation" } & {
  deleteNote: { __typename?: "DeleteNotePayload" } & Pick<
    DeleteNotePayload,
    "id" | "optimistic"
  > & { tags: Array<{ __typename?: "Tag" } & TagFieldsFragment> }
}

export type CreateTagMutationVariables = {
  id?: Maybe<Scalars["ID"]>
  name: Scalars["String"]
}

export type CreateTagMutation = { __typename?: "Mutation" } & {
  createTag: { __typename?: "TagPayload" } & Pick<TagPayload, "optimistic"> & {
      tag: { __typename?: "Tag" } & TagFieldsFragment
    }
}

export type UpdateTagMutationVariables = {
  id: Scalars["ID"]
  name: Scalars["String"]
}

export type UpdateTagMutation = { __typename?: "Mutation" } & {
  updateTag: { __typename?: "TagPayload" } & Pick<TagPayload, "optimistic"> & {
      tag: { __typename?: "Tag" } & TagFieldsFragment
    }
}

export type DeleteTagMutationVariables = {
  id: Scalars["ID"]
}

export type DeleteTagMutation = { __typename?: "Mutation" } & {
  deleteTag: { __typename?: "TagPayload" } & Pick<TagPayload, "optimistic"> & {
      tag: { __typename?: "Tag" } & TagFieldsFragment
    }
}

export type NotesQueryVariables = {}

export type NotesQuery = { __typename?: "Query" } & {
  notes: Array<{ __typename?: "Note" } & NoteFieldsFragment>
}

export type TagsQueryVariables = {}

export type TagsQuery = { __typename?: "Query" } & {
  tags: Array<{ __typename?: "Tag" } & TagFieldsFragment>
}

export type MainQueryVariables = {}

export type MainQuery = { __typename?: "Query" } & {
  notes: Array<{ __typename?: "Note" } & NoteFieldsFragment>
  tags: Array<{ __typename?: "Tag" } & TagFieldsFragment>
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
  Note: NoteObject
  Node: DeepPartial<Node>
  ID: DeepPartial<Scalars["ID"]>
  String: DeepPartial<Scalars["String"]>
  DateTime: DeepPartial<Scalars["DateTime"]>
  Tag: TagObject
  NonNegativeInt: DeepPartial<Scalars["NonNegativeInt"]>
  Mutation: {}
  CreateNoteInput: DeepPartial<CreateNoteInput>
  NotePayload: DeepPartial<
    Omit<NotePayload, "note"> & { note: ResolversTypes["Note"] }
  >
  Boolean: DeepPartial<Scalars["Boolean"]>
  UpdateNoteInput: DeepPartial<UpdateNoteInput>
  ChangeTagsPayload: DeepPartial<
    Omit<ChangeTagsPayload, "note" | "tag"> & {
      note: ResolversTypes["Note"]
      tag: ResolversTypes["Tag"]
    }
  >
  DeleteNotePayload: DeepPartial<
    Omit<DeleteNotePayload, "tags"> & { tags: Array<ResolversTypes["Tag"]> }
  >
  CreateTagInput: DeepPartial<CreateTagInput>
  TagPayload: DeepPartial<
    Omit<TagPayload, "tag" | "notes"> & {
      tag: ResolversTypes["Tag"]
      notes?: Maybe<Array<ResolversTypes["Note"]>>
    }
  >
  UpdateTagInput: DeepPartial<UpdateTagInput>
  TagName: DeepPartial<Scalars["TagName"]>
}

export type ChangeTagsPayloadResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["ChangeTagsPayload"]
> = {
  note?: Resolver<ResolversTypes["Note"], ParentType, ContextType>
  tag?: Resolver<ResolversTypes["Tag"], ParentType, ContextType>
  optimistic?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>
}

export interface DateTimeScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["DateTime"], any> {
  name: "DateTime"
}

export type DeleteNotePayloadResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["DeleteNotePayload"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  tags?: Resolver<Array<ResolversTypes["Tag"]>, ParentType, ContextType>
  optimistic?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>
}

export type MutationResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Mutation"]
> = {
  createNote?: Resolver<
    ResolversTypes["NotePayload"],
    ParentType,
    ContextType,
    MutationCreateNoteArgs
  >
  updateNote?: Resolver<
    ResolversTypes["NotePayload"],
    ParentType,
    ContextType,
    MutationUpdateNoteArgs
  >
  addTag?: Resolver<
    ResolversTypes["ChangeTagsPayload"],
    ParentType,
    ContextType,
    MutationAddTagArgs
  >
  removeTag?: Resolver<
    ResolversTypes["ChangeTagsPayload"],
    ParentType,
    ContextType,
    MutationRemoveTagArgs
  >
  deleteNote?: Resolver<
    ResolversTypes["DeleteNotePayload"],
    ParentType,
    ContextType,
    MutationDeleteNoteArgs
  >
  createTag?: Resolver<
    ResolversTypes["TagPayload"],
    ParentType,
    ContextType,
    MutationCreateTagArgs
  >
  updateTag?: Resolver<
    ResolversTypes["TagPayload"],
    ParentType,
    ContextType,
    MutationUpdateTagArgs
  >
  deleteTag?: Resolver<
    ResolversTypes["TagPayload"],
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
}

export type NotePayloadResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["NotePayload"]
> = {
  note?: Resolver<ResolversTypes["Note"], ParentType, ContextType>
  optimistic?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>
}

export type QueryResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Query"]
> = {
  notes?: Resolver<Array<ResolversTypes["Note"]>, ParentType, ContextType>
  tags?: Resolver<Array<ResolversTypes["Tag"]>, ParentType, ContextType>
}

export type TagResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["Tag"]
> = {
  id?: Resolver<ResolversTypes["ID"], ParentType, ContextType>
  name?: Resolver<ResolversTypes["String"], ParentType, ContextType>
  noteCount?: Resolver<
    ResolversTypes["NonNegativeInt"],
    ParentType,
    ContextType
  >
}

export interface TagNameScalarConfig
  extends GraphQLScalarTypeConfig<ResolversTypes["TagName"], any> {
  name: "TagName"
}

export type TagPayloadResolvers<
  ContextType = Context,
  ParentType = ResolversTypes["TagPayload"]
> = {
  tag?: Resolver<ResolversTypes["Tag"], ParentType, ContextType>
  notes?: Resolver<
    Maybe<Array<ResolversTypes["Note"]>>,
    ParentType,
    ContextType
  >
  optimistic?: Resolver<ResolversTypes["Boolean"], ParentType, ContextType>
}

export type Resolvers<ContextType = Context> = {
  ChangeTagsPayload?: ChangeTagsPayloadResolvers<ContextType>
  DateTime?: GraphQLScalarType
  DeleteNotePayload?: DeleteNotePayloadResolvers<ContextType>
  Mutation?: MutationResolvers<ContextType>
  Node?: NodeResolvers
  NonNegativeInt?: GraphQLScalarType
  Note?: NoteResolvers<ContextType>
  NotePayload?: NotePayloadResolvers<ContextType>
  Query?: QueryResolvers<ContextType>
  Tag?: TagResolvers<ContextType>
  TagName?: GraphQLScalarType
  TagPayload?: TagPayloadResolvers<ContextType>
}

/**
 * @deprecated
 * Use "Resolvers" root object instead. If you wish to get "IResolvers", add "typesPrefix: I" to your config.
 */
export type IResolvers<ContextType = Context> = Resolvers<ContextType>
