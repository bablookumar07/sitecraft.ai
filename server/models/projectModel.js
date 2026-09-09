import mongoose from "mongoose";

const projectFileSchema = new mongoose.Schema(
  {
    path: {
      type: String,
      required: true,
      trim: true,
    },

    content: {
      type: String,
      default: "",
    },
  },
  {
    _id: false,
  }
);

const projectMessageSchema = new mongoose.Schema(
  {
    role: {
      type: String,
      enum: ["user", "assistant", "system"],
      required: true,
    },

    content: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const projectSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    name: {
      type: String,
      required: [true, "Project name is required"],
      trim: true,
    },

    description: {
      type: String,
      default: "",
      trim: true,
    },

    prompt: {
      type: String,
      required: [true, "Project prompt is required"],
      trim: true,
    },

    status: {
      type: String,
      enum: ["draft", "generating", "ready", "failed"],
      default: "draft",
    },
    
    published: {
  type: Boolean,
  default: false,
},

publishedAt: {
  type: Date,
  default: null,
},

    version: {
      type: Number,
      default: 1,
    },

    messages: {
      type: [projectMessageSchema],
      default: [],
    },

    files: {
      type: [projectFileSchema],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

const Project = mongoose.model("Project", projectSchema);

export default Project;