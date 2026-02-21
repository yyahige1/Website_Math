/* ========================================
   GRAPHING.JS - Module de graphiques avec Canvas
   ======================================== */

/**
 * Classe pour dessiner des graphiques de fonctions
 */
class GraphCanvas {
    constructor(canvasId, options = {}) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) {
            console.error(`Canvas ${canvasId} not found`);
            return;
        }

        this.ctx = this.canvas.getContext('2d');

        // Options par défaut
        this.options = {
            width: options.width || 500,
            height: options.height || 350,
            padding: options.padding || 40,
            xMin: options.xMin || -10,
            xMax: options.xMax || 10,
            yMin: options.yMin || -10,
            yMax: options.yMax || 10,
            gridColor: options.gridColor || '#e0e0e0',
            axisColor: options.axisColor || '#333',
            curveColor: options.curveColor || '#2196F3',
            curveWidth: options.curveWidth || 2,
            showGrid: options.showGrid !== false,
            showLabels: options.showLabels !== false
        };

        // Définir les dimensions du canvas
        this.canvas.width = this.options.width;
        this.canvas.height = this.options.height;

        // Zone de dessin (en tenant compte du padding)
        this.drawWidth = this.options.width - 2 * this.options.padding;
        this.drawHeight = this.options.height - 2 * this.options.padding;
    }

    /**
     * Convertit une coordonnée mathématique x en coordonnée canvas
     */
    toCanvasX(x) {
        const ratio = (x - this.options.xMin) / (this.options.xMax - this.options.xMin);
        return this.options.padding + ratio * this.drawWidth;
    }

    /**
     * Convertit une coordonnée mathématique y en coordonnée canvas
     */
    toCanvasY(y) {
        const ratio = (y - this.options.yMin) / (this.options.yMax - this.options.yMin);
        // Inverser car canvas Y croît vers le bas
        return this.options.height - this.options.padding - ratio * this.drawHeight;
    }

    /**
     * Efface le canvas
     */
    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.ctx.fillStyle = '#fff';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    }

    /**
     * Dessine la grille
     */
    drawGrid() {
        if (!this.options.showGrid) return;

        this.ctx.strokeStyle = this.options.gridColor;
        this.ctx.lineWidth = 0.5;

        // Lignes verticales
        for (let x = Math.ceil(this.options.xMin); x <= this.options.xMax; x++) {
            const canvasX = this.toCanvasX(x);
            this.ctx.beginPath();
            this.ctx.moveTo(canvasX, this.options.padding);
            this.ctx.lineTo(canvasX, this.options.height - this.options.padding);
            this.ctx.stroke();
        }

        // Lignes horizontales
        for (let y = Math.ceil(this.options.yMin); y <= this.options.yMax; y++) {
            const canvasY = this.toCanvasY(y);
            this.ctx.beginPath();
            this.ctx.moveTo(this.options.padding, canvasY);
            this.ctx.lineTo(this.options.width - this.options.padding, canvasY);
            this.ctx.stroke();
        }
    }

    /**
     * Dessine les axes
     */
    drawAxes() {
        this.ctx.strokeStyle = this.options.axisColor;
        this.ctx.lineWidth = 2;

        // Axe X (y = 0)
        const y0 = this.toCanvasY(0);
        this.ctx.beginPath();
        this.ctx.moveTo(this.options.padding, y0);
        this.ctx.lineTo(this.options.width - this.options.padding, y0);
        this.ctx.stroke();

        // Axe Y (x = 0)
        const x0 = this.toCanvasX(0);
        this.ctx.beginPath();
        this.ctx.moveTo(x0, this.options.padding);
        this.ctx.lineTo(x0, this.options.height - this.options.padding);
        this.ctx.stroke();

        // Flèches
        this.drawArrow(this.options.width - this.options.padding, y0, 0); // →
        this.drawArrow(x0, this.options.padding, 90); // ↑

        // Labels
        if (this.options.showLabels) {
            this.ctx.fillStyle = this.options.axisColor;
            this.ctx.font = '14px Arial';
            this.ctx.fillText('x', this.options.width - this.options.padding + 10, y0 + 5);
            this.ctx.fillText('y', x0 + 5, this.options.padding - 10);
        }
    }

    /**
     * Dessine une flèche
     */
    drawArrow(x, y, angle) {
        const size = 8;
        this.ctx.save();
        this.ctx.translate(x, y);
        this.ctx.rotate((angle * Math.PI) / 180);
        this.ctx.beginPath();
        this.ctx.moveTo(0, 0);
        this.ctx.lineTo(-size, -size / 2);
        this.ctx.lineTo(-size, size / 2);
        this.ctx.closePath();
        this.ctx.fillStyle = this.options.axisColor;
        this.ctx.fill();
        this.ctx.restore();
    }

    /**
     * Dessine les graduations
     */
    drawTicks() {
        this.ctx.strokeStyle = this.options.axisColor;
        this.ctx.fillStyle = this.options.axisColor;
        this.ctx.font = '12px Arial';
        this.ctx.textAlign = 'center';

        const y0 = this.toCanvasY(0);
        const x0 = this.toCanvasX(0);

        // Graduations sur l'axe X
        for (let x = Math.ceil(this.options.xMin); x <= this.options.xMax; x++) {
            if (x === 0) continue;
            const canvasX = this.toCanvasX(x);

            // Trait de graduation
            this.ctx.beginPath();
            this.ctx.moveTo(canvasX, y0 - 5);
            this.ctx.lineTo(canvasX, y0 + 5);
            this.ctx.stroke();

            // Label
            if (this.options.showLabels) {
                this.ctx.fillText(x.toString(), canvasX, y0 + 20);
            }
        }

        // Graduations sur l'axe Y
        this.ctx.textAlign = 'right';
        for (let y = Math.ceil(this.options.yMin); y <= this.options.yMax; y++) {
            if (y === 0) continue;
            const canvasY = this.toCanvasY(y);

            // Trait de graduation
            this.ctx.beginPath();
            this.ctx.moveTo(x0 - 5, canvasY);
            this.ctx.lineTo(x0 + 5, canvasY);
            this.ctx.stroke();

            // Label
            if (this.options.showLabels) {
                this.ctx.fillText(y.toString(), x0 - 10, canvasY + 4);
            }
        }
    }

    /**
     * Dessine une fonction y = f(x)
     */
    drawFunction(func, color = null, lineWidth = null) {
        this.ctx.strokeStyle = color || this.options.curveColor;
        this.ctx.lineWidth = lineWidth || this.options.curveWidth;
        this.ctx.beginPath();

        let started = false;
        const step = (this.options.xMax - this.options.xMin) / 500; // 500 points

        for (let x = this.options.xMin; x <= this.options.xMax; x += step) {
            const y = func(x);

            // Vérifier que y est dans les limites
            if (isNaN(y) || !isFinite(y)) continue;

            const canvasX = this.toCanvasX(x);
            const canvasY = this.toCanvasY(y);

            if (!started) {
                this.ctx.moveTo(canvasX, canvasY);
                started = true;
            } else {
                this.ctx.lineTo(canvasX, canvasY);
            }
        }

        this.ctx.stroke();
    }

    /**
     * Dessine un point
     */
    drawPoint(x, y, color = '#e74c3c', radius = 4, label = null) {
        const canvasX = this.toCanvasX(x);
        const canvasY = this.toCanvasY(y);

        this.ctx.fillStyle = color;
        this.ctx.beginPath();
        this.ctx.arc(canvasX, canvasY, radius, 0, 2 * Math.PI);
        this.ctx.fill();

        // Contour blanc
        this.ctx.strokeStyle = '#fff';
        this.ctx.lineWidth = 2;
        this.ctx.stroke();

        // Label optionnel
        if (label) {
            this.ctx.fillStyle = '#333';
            this.ctx.font = '12px Arial';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(label, canvasX, canvasY - 10);
        }
    }

    /**
     * Colorie une zone (pour les inéquations)
     */
    fillRegion(x1, x2, color = 'rgba(76, 175, 80, 0.2)') {
        const canvasX1 = this.toCanvasX(x1);
        const canvasX2 = this.toCanvasX(x2);

        this.ctx.fillStyle = color;
        this.ctx.fillRect(
            canvasX1,
            this.options.padding,
            canvasX2 - canvasX1,
            this.drawHeight
        );
    }

    /**
     * Dessine une parabole ax² + bx + c
     */
    drawParabola(a, b, c, color = null) {
        const func = (x) => a * x * x + b * x + c;
        this.drawFunction(func, color);
    }

    /**
     * Dessine le graphique complet d'une inéquation du 2nd degré
     */
    /**
     * Dessine un cercle de centre (cx, cy) et de rayon r
     */
    drawCircle(cx, cy, r, color = '#3498db', lineWidth = 2.5) {
        const ctx = this.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.beginPath();

        const steps = 200;
        for (let i = 0; i <= steps; i++) {
            const angle = (2 * Math.PI * i) / steps;
            const x = cx + r * Math.cos(angle);
            const y = cy + r * Math.sin(angle);
            const canvasX = this.toCanvasX(x);
            const canvasY = this.toCanvasY(y);
            if (i === 0) {
                ctx.moveTo(canvasX, canvasY);
            } else {
                ctx.lineTo(canvasX, canvasY);
            }
        }
        ctx.closePath();
        ctx.stroke();
    }

    /**
     * Dessine une droite y = mx + p
     */
    drawLineEquation(m, p, color = '#3498db', lineWidth = 2.5) {
        this.drawFunction(x => m * x + p, color, lineWidth);
    }

    /**
     * Dessine une droite ax + by + c = 0
     */
    drawLineCartesian(a, b, c, color = '#3498db', lineWidth = 2.5) {
        if (b !== 0) {
            this.drawFunction(x => (-a * x - c) / b, color, lineWidth);
        } else {
            const x = -c / a;
            const canvasX = this.toCanvasX(x);
            this.ctx.strokeStyle = color;
            this.ctx.lineWidth = lineWidth;
            this.ctx.beginPath();
            this.ctx.moveTo(canvasX, this.options.padding);
            this.ctx.lineTo(canvasX, this.options.height - this.options.padding);
            this.ctx.stroke();
        }
    }

    /**
     * Dessine un segment en pointilles
     */
    drawDashedLine(x1, y1, x2, y2, color = 'rgba(150,150,150,0.6)', lineWidth = 1.5) {
        const ctx = this.ctx;
        ctx.strokeStyle = color;
        ctx.lineWidth = lineWidth;
        ctx.setLineDash([5, 5]);
        ctx.beginPath();
        ctx.moveTo(this.toCanvasX(x1), this.toCanvasY(y1));
        ctx.lineTo(this.toCanvasX(x2), this.toCanvasY(y2));
        ctx.stroke();
        ctx.setLineDash([]);
    }

    drawQuadraticInequality(a, b, c, sign, roots = null) {
        this.clear();
        this.drawGrid();
        this.drawAxes();
        this.drawTicks();

        // Dessiner la parabole
        this.drawParabola(a, b, c, '#2196F3');

        // Marquer les racines si elles existent
        if (roots) {
            if (roots.x1 !== undefined && roots.x2 !== undefined) {
                this.drawPoint(roots.x1, 0, '#e74c3c', 5, `x₁=${roots.x1.toFixed(2)}`);
                this.drawPoint(roots.x2, 0, '#e74c3c', 5, `x₂=${roots.x2.toFixed(2)}`);

                // Colorier les zones de solution
                if (sign === '>' || sign === '>=') {
                    if (a > 0) {
                        // Extérieur de la parabole
                        this.fillRegion(this.options.xMin, roots.x1, 'rgba(76, 175, 80, 0.15)');
                        this.fillRegion(roots.x2, this.options.xMax, 'rgba(76, 175, 80, 0.15)');
                    } else {
                        // Intérieur
                        this.fillRegion(roots.x1, roots.x2, 'rgba(76, 175, 80, 0.15)');
                    }
                } else {
                    if (a > 0) {
                        // Intérieur
                        this.fillRegion(roots.x1, roots.x2, 'rgba(76, 175, 80, 0.15)');
                    } else {
                        // Extérieur
                        this.fillRegion(this.options.xMin, roots.x1, 'rgba(76, 175, 80, 0.15)');
                        this.fillRegion(roots.x2, this.options.xMax, 'rgba(76, 175, 80, 0.15)');
                    }
                }
            } else if (roots.x0 !== undefined) {
                this.drawPoint(roots.x0, 0, '#e74c3c', 5, `x₀=${roots.x0.toFixed(2)}`);
            }
        } else {
            // Pas de racines : toute la zone ou aucune zone
            if ((sign === '>' || sign === '>=') && a > 0) {
                this.fillRegion(this.options.xMin, this.options.xMax, 'rgba(76, 175, 80, 0.15)');
            } else if ((sign === '<' || sign === '<=') && a < 0) {
                this.fillRegion(this.options.xMin, this.options.xMax, 'rgba(76, 175, 80, 0.15)');
            }
        }
    }
}
