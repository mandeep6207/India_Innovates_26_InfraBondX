from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()


# ─── USER ────────────────────────────────────────────────────────────────────
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120))
    email = db.Column(db.String(120), unique=True)
    password_hash = db.Column(db.String(255))
    role = db.Column(db.String(20))  # INVESTOR / ISSUER / ADMIN
    wallet_balance = db.Column(db.Float, default=0.0)  # simulated wallet
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─── PROJECT ─────────────────────────────────────────────────────────────────
class Project(db.Model):
    id = db.Column(db.Integer, primary_key=True)

    # issuer linkage
    issuer_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=True)

    title = db.Column(db.String(200))
    category = db.Column(db.String(50))
    location = db.Column(db.String(120))
    description = db.Column(db.Text)

    # Map coordinates
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)

    funding_target = db.Column(db.Integer)
    funding_raised = db.Column(db.Integer, default=0)

    token_price = db.Column(db.Integer, default=100)
    roi_percent = db.Column(db.Float, default=12.0)
    tenure_months = db.Column(db.Integer, default=24)

    risk_level = db.Column(db.String(20), default="MEDIUM")
    risk_score = db.Column(db.Integer, default=55)  # 0-100 dynamic score

    # Lifecycle: PENDING / ACTIVE / FROZEN / COMPLETED / FAILED
    status = db.Column(db.String(30), default="PENDING")

    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─── MILESTONE ────────────────────────────────────────────────────────────────
class Milestone(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"))

    title = db.Column(db.String(200))
    description = db.Column(db.Text, nullable=True)         # NEW: milestone description
    required_amount = db.Column(db.Float, nullable=True)    # NEW: amount required for milestone
    escrow_release_percent = db.Column(db.Integer, default=20)

    # Workflow status: PENDING / SUBMITTED / COMPLETED
    status = db.Column(db.String(30), default="PENDING")

    # proof file url/path (set by issuer on submit)
    proof_url = db.Column(db.String(500), nullable=True)

    # Timestamp when admin approved & funds released
    approved_at = db.Column(db.DateTime, nullable=True)

    created_at = db.Column(db.DateTime, default=datetime.utcnow)



# ─── ESCROW ───────────────────────────────────────────────────────────────────
class Escrow(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"), unique=True)
    total_locked = db.Column(db.Float, default=0.0)
    total_released = db.Column(db.Float, default=0.0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─── TOKEN HOLDING ────────────────────────────────────────────────────────────
class TokenHolding(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"))
    token_count = db.Column(db.Integer, default=0)
    avg_buy_price = db.Column(db.Float, default=0.0)


# ─── TRANSACTION ─────────────────────────────────────────────────────────────
class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    tx_hash = db.Column(db.String(100))
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"))
    # MINT / TRANSFER / ESCROW_RELEASE / REFUND / REWARD
    tx_type = db.Column(db.String(30))
    amount = db.Column(db.Float, default=0.0)
    token_count = db.Column(db.Integer, default=0)
    status = db.Column(db.String(30), default="SUCCESS")
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─── MARKETPLACE LISTING ─────────────────────────────────────────────────────
class MarketplaceListing(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    seller_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"))
    token_count = db.Column(db.Integer)
    price_per_token = db.Column(db.Integer)
    status = db.Column(db.String(30), default="ACTIVE")  # ACTIVE / SOLD
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─── PROJECT DOCUMENT ────────────────────────────────────────────────────────
class ProjectDocument(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"))
    uploader_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    # e.g. TENDER / ENV_CLEARANCE / MILESTONE_PROOF / PHOTO / VIDEO / OTHER
    doc_type = db.Column(db.String(50), default="OTHER")
    filename = db.Column(db.String(255))
    file_url = db.Column(db.String(500))
    description = db.Column(db.Text, nullable=True)
    uploaded_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─── PROJECT UPDATE (Live Progress) ──────────────────────────────────────────
class ProjectUpdate(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"))
    issuer_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    # IMAGE / VIDEO / TEXT
    media_type = db.Column(db.String(20), default="TEXT")
    media_url = db.Column(db.String(500), nullable=True)
    description = db.Column(db.Text)
    latitude = db.Column(db.Float, nullable=True)
    longitude = db.Column(db.Float, nullable=True)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)


# ─── REWARD ──────────────────────────────────────────────────────────────────
class Reward(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"))
    milestone_id = db.Column(db.Integer, db.ForeignKey("milestone.id"), nullable=True)
    # e.g. TOLL_DISCOUNT / TRAVEL_CREDIT / SHOPPING_DISCOUNT / INFRA_POINTS
    reward_type = db.Column(db.String(50), default="INFRA_POINTS")
    reward_points = db.Column(db.Integer, default=0)
    description = db.Column(db.String(255), nullable=True)
    granted_at = db.Column(db.DateTime, default=datetime.utcnow)


# ─── TOKEN LEDGER (Blockchain-Ready) ─────────────────────────────────────────
class TokenLedger(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    token_id = db.Column(db.String(100), unique=True)  # unique per token batch
    tx_hash = db.Column(db.String(100))
    prev_hash = db.Column(db.String(100), nullable=True)  # chain simulation
    block_index = db.Column(db.Integer, default=0)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    project_id = db.Column(db.Integer, db.ForeignKey("project.id"))
    # MINT / TRANSFER / ESCROW_RELEASE / REFUND
    tx_type = db.Column(db.String(30))
    amount = db.Column(db.Float, default=0.0)
    token_count = db.Column(db.Integer, default=0)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
