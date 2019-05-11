/* tslint:disable-next-line:no-implicit-dependencies */
import { DeepPartial } from "ts-essentials"
import uuid from "uuid/v4"

import { ID } from "../utils"

export enum DBType {
  Note = "Note",
  Tag = "Tag",
}

export interface INode {
  id: string
  type: DBType
}

export interface INoteDb extends INode {
  type: DBType.Note
  title: string
  content: string
  createdAt: Date
  modifiedAt: Date
  tagIds: ID[]
}

export interface ITagDb extends INode {
  type: DBType.Tag
  name: string
  noteIds: ID[]
}

// Types for parent objects (1st arg) in field resolvers
export type NoteObject = DeepPartial<INoteDb>
export type TagObject = DeepPartial<ITagDb>

type IObjectDb = INoteDb | ITagDb

const noteIds: ID[] = []
const tagIds: ID[] = []

const ids: { [key: string]: IObjectDb } = {}

// This overload is just so that I can pass the function like so: someIds.map(get)
function get<T extends IObjectDb>(id: ID, index: number): T
function get<T extends IObjectDb>(id: ID, type?: DBType): T

function get(id: ID, type?: DBType | number) {
  if (!ids[id]) {
    throw new Error(`Item not found. Id: ${id}`)
  }
  if (type && typeof type !== "number" && ids[id].type !== type) {
    throw new Error(
      `Provided id doesn't belong to a ${type}, but to a ${
        ids[id].type
      }. Id: ${id}`,
    )
  }
  return ids[id]
}

function put<T extends IObjectDb>(obj: T) {
  return (ids[obj.id] = obj)
}

// prettier-ignore
function upsert<T extends IObjectDb>(id: ID, type: DBType, diff: (obj: T) => T): T
function upsert<T extends IObjectDb>(id: ID, diff: (obj: T) => T): T

function upsert(id: ID, arg2: any, arg3?: any) {
  return typeof arg2 === "function"
    ? put(arg2(get(id)))
    : put(arg3(get(id, arg2)))
}

function remove(id: ID) {
  if (!ids[id]) {
    throw new Error(`Item not found. Id: ${id}`)
  }
  delete ids[id]
  return true
}

export const db = {
  my: {
    noteIds,
    tagIds,
  },
  get,
  put,
  upsert,
  remove,
  check: get,
}

export type Database = typeof db
