import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

/* =========================
   GET /api/tasks/:id
========================= */
export async function GET(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const task = await prisma.task.findUnique({
    where: { id },
    include: {
      project: true,
      assignedTo: { select: { id: true, username: true } },
    },
  });

  if (!task) {
    return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
  }

  return NextResponse.json(task);
}

/* =========================
   PUT /api/tasks/:id
========================= */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const body = await req.json();

  const old = await prisma.task.findUnique({ where: { id } });
  if (!old) {
    return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
  }

  const task = await prisma.task.update({
    where: { id },
    data: {
      title: body.title ?? old.title,
      description: body.description ?? old.description,
      status: body.status ?? old.status,
      priority: body.priority ?? old.priority,
      projectId: body.projectId ?? old.projectId,
      assignedToId: body.assignedTo ?? old.assignedToId,
      dueDate: body.dueDate ?? old.dueDate,
      estimatedHours: body.estimatedHours ?? old.estimatedHours,
    },
    include: {
      project: true,
      assignedTo: { select: { id: true, username: true } },
    },
  });

  return NextResponse.json(task);
}

/* =========================
   DELETE /api/tasks/:id
========================= */
export async function DELETE(
  _req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const id = parseInt(params.id, 10);
  if (isNaN(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const task = await prisma.task.findUnique({ where: { id } });
  if (!task) {
    return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
  }

  await prisma.history.create({
    data: {
      taskId: id,
      userId: session.userId,
      action: "DELETED",
      oldValue: task.title,
    },
  });

  await prisma.task.delete({ where: { id } });

  return NextResponse.json({ ok: true });
}
